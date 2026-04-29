using Microsoft.Extensions.Logging;
using OVI.Domain.Interfaces;

namespace Dashboard.Adapters;

/// <summary>
/// ACL adapter: delegates to the legacy AESEncryptDecrypt static class.
/// This adapter absorbs the legacy static API and presents the clean ICryptoService interface.
/// Phase 2+ will replace this with a vault-backed implementation in OVI.Infrastructure.
/// </summary>
internal sealed class LegacyCryptoAdapter(ILogger<LegacyCryptoAdapter> logger) : ICryptoService
{
    public string Decrypt(string cipherText)
    {
        logger.LogDebug("Decrypting via legacy AESEncryptDecrypt");
        return Models.AESEncryptDecrypt.DecryptStringAES(cipherText);
    }

    public string Encrypt(string plainText)
    {
        throw new NotImplementedException("Encrypt is not available in the legacy crypto adapter. Implement in Phase 2.");
    }
}
