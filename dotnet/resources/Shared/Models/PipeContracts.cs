using MessagePack;

namespace Shared.Models
{
    /// <summary>
    /// Універсальний "конверт", у який ми будемо загортати абсолютно всі наші команди.
    /// </summary>
    [MessagePackObject]
    public class PipeMessage
    {
        // Назва команди (наприклад: "SpawnPlayer", "GiveWeapon", "Notify")
        [Key(0)] public string Command { get; set; } = null!;

        // Серіалізовані дані конкретної команди (вміст)
        [Key(1)] 
        public byte[] Payload { get; set; } = null!;
    }

    /// <summary>
    /// Конкретна модель даних (DTO) для команди спавну гравця.
    /// </summary>
    [MessagePackObject]
    public class SpawnPlayerDto
    {
        [Key(0)] 
        public string PlayerName { get; set; } = null!;

        [Key(1)] 
        public float X { get; set; }

        [Key(2)] 
        public float Y { get; set; }

        [Key(3)] 
        public float Z { get; set; }

        // Приклад необов'язкового поля: вимір (Dimension).
        // Якщо .NET 9 його не надішле, гравець заспавниться у нульовому (стандартному) вимірі.
        [Key(4)] 
        public uint? Dimension { get; set; }
    }
}