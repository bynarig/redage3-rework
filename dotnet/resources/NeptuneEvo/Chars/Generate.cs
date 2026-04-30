using System;
using System.Linq;
using System.Text.RegularExpressions;
using OtpNet;
using NeptuneEvo.SDK;

namespace NeptuneEvo.Chars
{
    internal class Generate
    {
        private const string DefaultPassword = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
        private const string OneTimePassword = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        private static readonly nLog Log = new nLog("Chars.Generate");

        private static readonly Random random = new Random();

        public static string RandomString(int length, bool type = false)
        {
            try
            {
                if (!type)
                    return new string(Enumerable.Repeat(DefaultPassword, length).Select(s => s[random.Next(s.Length)])
                        .ToArray());
                return new string(Enumerable.Repeat(OneTimePassword, length).Select(s => s[random.Next(s.Length)])
                    .ToArray());
            }
            catch (Exception e)
            {
                Log.Write($"RandomString Exception: {e}");
                return null;
            }
        }

        public static string RandomOneTimePassword()
        {
            try
            {
                var randomstring = RandomString(random.Next(6, 10), true);
                if (randomstring == null) return null;
                var secretkey = Base32Encoding.ToBytes(randomstring);
                var totp = new Totp(secretkey);
                return totp.ComputeTotp();
            }
            catch (Exception e)
            {
                Log.Write($"RandomOneTimePassword Exception: {e}");
                return null;
            }
        }

        public static string ObfuscateEmail(string email)
        {
            try
            {
                var displayCase = email;

                var partToBeObfuscated = Regex.Match(displayCase, @"[^@]*").Value;
                if (partToBeObfuscated.Length - 3 > 0)
                {
                    var obfuscation = "";
                    for (var i = 0; i < partToBeObfuscated.Length - 3; i++) obfuscation += "*";
                    displayCase = string.Format("{0}{1}{2}{3}", displayCase[0], displayCase[1], obfuscation,
                        displayCase.Substring(partToBeObfuscated.Length - 1));
                }
                else if (partToBeObfuscated.Length - 3 == 0)
                {
                    displayCase = string.Format("{0}*{1}", displayCase[0], displayCase.Substring(2));
                }

                return displayCase;
            }
            catch (Exception e)
            {
                Log.Write($"ObfuscateEmail Exception: {e}");
                return "error";
            }
        }
    }
}