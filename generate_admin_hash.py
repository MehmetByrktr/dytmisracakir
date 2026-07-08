from getpass import getpass
from werkzeug.security import generate_password_hash

password = getpass("Admin şifreni yaz: ")
confirm = getpass("Tekrar yaz: ")

if password != confirm:
    raise SystemExit("Şifreler eşleşmedi.")

if len(password) < 10:
    raise SystemExit("Daha güçlü bir şifre seç. En az 10 karakter önerilir.")

print("\nADMIN_PASSWORD_HASH değerini Render Environment içine ekle:\n")
print(generate_password_hash(password))
