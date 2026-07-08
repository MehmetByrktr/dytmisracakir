# Dyt. Mısra Çakır V3 Dependency Fix

Yerelde alınan hata düzeltildi:

```text
ModuleNotFoundError: No module named 'bleach'
```

`requirements.txt` dosyasına güvenlik/görsel/deploy için gereken paketler eklendi:

- bleach
- tinycss2
- Pillow
- cloudinary

## Yerelde çalıştırmadan önce

```bash
pip install -r requirements.txt
```

veya sadece eksik paketleri kurmak için:

```bash
pip install bleach tinycss2 Pillow cloudinary
```
