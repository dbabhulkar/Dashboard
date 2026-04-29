namespace OVI.Domain.Interfaces;

/// <summary>
/// Abstraction over encryption/decryption operations.
/// Phase 1: legacy adapter delegates to AESEncryptDecrypt.
/// Phase 2+: vault-backed key management implementation.
/// </summary>
public interface ICryptoService
{
    string Decrypt(string cipherText);
    string Encrypt(string plainText);
}
