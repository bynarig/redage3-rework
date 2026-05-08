using System;
using System.IO.Pipes;
using System.Threading.Tasks;
using GTANetworkAPI;
using MessagePack;
using Shared.Models; // Підключаємо наші контракти

namespace NeptuneEvo
{
    public class Main : Script
    {
        private NamedPipeClientStream _pipeClient;

        // Подія запуску сервера RAGE
        [ServerEvent(Event.ResourceStart)]
        public void OnResourceStart()
        {
            NAPI.Util.ConsoleOutput("==> Initialisation of RAGE:MP Driver...");

            // Запускаємо підключення у фоновому потоці, щоб не заморозити запуск самого RAGE
            Task.Run(ConnectToLogicServer);
        }

        private async Task ConnectToLogicServer()
        {
            // Підключаємося до труби "RageIPC" на локальному комп'ютері (".")
            _pipeClient = new NamedPipeClientStream(".", "RageIPC", PipeDirection.InOut, PipeOptions.Asynchronous);

            NAPI.Util.ConsoleOutput("[Driver] Waiting for logics connection (.NET 9)...");

            try
            {
                // Чекаємо, поки CoreLogic сервер створить трубу
                await _pipeClient.ConnectAsync();
                NAPI.Util.ConsoleOutput("[Driver] ✅ Connected with logics!");

                // Запускаємо безкінечний цикл слухання нових повідомлень
                while (_pipeClient.IsConnected)
                {
                    // MessagePack сам чекає байти і розпаковує їх у PipeMessage
                    var message = await MessagePackSerializer.DeserializeAsync<PipeMessage>(_pipeClient);

                    if (message != null)
                    {
                        HandleIncomingCommand(message);
                    }
                }
            }
            catch (Exception ex)
            {
                NAPI.Util.ConsoleOutput($"[Driver] ❌ Error of Pipe: {ex.Message}");
            }
        }

        private void HandleIncomingCommand(PipeMessage message)
        {
            // Перевіряємо, що це за команда
            if (message.Command == "SpawnPlayer")
            {
                // Розпаковуємо вміст команди (Payload) у конкретну модель
                var data = MessagePackSerializer.Deserialize<SpawnPlayerDto>(message.Payload);

                // ⚠️ КРИТИЧНО ВАЖЛИВО ⚠️
                // Код зараз виконується у фоновому потоці Pipe. 
                // Якщо ми викличемо NAPI тут, сервер миттєво впаде (Crash).
                // Тому ми перекидаємо виконання в Головний потік RAGE:MP через NAPI.Task.Run:
                
                NAPI.Task.Run(() =>
                {
                    // Шукаємо гравця за іменем
                    var player = NAPI.Player.GetPlayerFromName(data.PlayerName);

                    if (player != null)
                    {
                        // Виконуємо спавн
                        NAPI.Player.SpawnPlayer(player, new Vector3(data.X, data.Y, data.Z));

                        // Якщо .NET 9 надіслав вимір (не null), застосовуємо його
                        if (data.Dimension.HasValue)
                        {
                            player.Dimension = data.Dimension.Value;
                        }

                        NAPI.Util.ConsoleOutput($"[Драйвер] Гравця {data.PlayerName} успішно заспавнено!");
                    }
                    else
                    {
                        NAPI.Util.ConsoleOutput($"[Драйвер] Гравець {data.PlayerName} не знайдений на сервері.");
                    }
                });
            }
        }
    }
}