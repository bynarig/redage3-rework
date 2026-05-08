using System;
using System.IO.Pipes;
using System.Threading.Tasks;
using MessagePack;
using Shared.Models; // Підключаємо наші контракти

namespace CoreLogic
{
    class Program
    {
        static async Task Main(string[] args)
        {
            Console.Title = "Logic Server (.NET 9)";
            Console.WriteLine("Запуск .NET 9 Logic Server...");

            // 1. Створюємо трубу (Pipe). 
            // "RageIPC" - це назва труби. Вона має бути абсолютно ідентичною на обох серверах.
            // PipeDirection.InOut - ми можемо і писати, і читати.
            using var pipeServer = new NamedPipeServerStream(
                "RageIPC", 
                PipeDirection.InOut, 
                1, // Тільки 1 підключення (наш RAGE драйвер)
                PipeTransmissionMode.Byte, 
                PipeOptions.Asynchronous);

            Console.WriteLine("Очікування підключення від RAGE:MP драйвера...");
            
            // Програма зупиниться тут і буде чекати, поки RAGE сервер не запуститься
            await pipeServer.WaitForConnectionAsync();
            Console.WriteLine("✅ RAGE:MP успішно підключено!\n");
            
            Console.WriteLine("Введіть 'spawn', щоб відправити команду гравцю, або 'exit' для виходу.");

            // 2. Безкінечний цикл для інтерактивного тестування
            while (true)
            {
                var input = Console.ReadLine();

                if (input?.ToLower() == "exit")
                    break;

                if (input?.ToLower() == "spawn")
                {
                    // 3. Формуємо дані
                    var spawnData = new SpawnPlayerDto
                    {
                        PlayerName = "Admin", // У грі треба буде вказати своє ім'я SocialClub
                        X = -425.5f,
                        Y = 1123.6f,
                        Z = 325.8f,
                        Dimension = 0
                    };

                    // 4. Пакуємо SpawnPlayerDto у масив байтів
                    byte[] payloadBytes = MessagePackSerializer.Serialize(spawnData);

                    // 5. Загортаємо масив у наш універсальний "конверт"
                    var message = new PipeMessage
                    {
                        Command = "SpawnPlayer",
                        Payload = payloadBytes
                    };

                    try
                    {
                        // 6. Відправляємо конверт у трубу
                        await MessagePackSerializer.SerializeAsync(pipeServer, message);
                        await pipeServer.FlushAsync(); // Гарантуємо, що байти полетіли

                        Console.WriteLine($"[->] Команду SpawnPlayer відправлено!");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"[!] Помилка відправки: {ex.Message}");
                    }
                }
            }
        }
    }
}