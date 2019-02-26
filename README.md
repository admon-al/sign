Sign JS files with OpenPGP [![Build Status](https://travis-ci.com/admon-al/sign.svg?branch=master)](https://travis-ci.com/admon-al/sign) [![Coverage Status](https://coveralls.io/repos/github/admon-al/sign/badge.svg)](https://coveralls.io/github/admon-al/sign)
=========
Проект позволяющий подписывать JavaScript файлы с использованием OpenPGP и проверять подпись на соответствие содержанию.
## Генерация ключей (Ubuntu)
устанвливаем необходимый пакет\
 `sudo apt-get install gpa`\
теперь генерируем OpenPGP ключ\
`gpg --gen-key`\
затем выбираем ответы:
```
Please select what kind of key you want:
   (1) RSA and RSA (default)
   (2) DSA and Elgamal
   (3) DSA (sign only)
   (4) RSA (sign only)
Your selection? 1

RSA keys may be between 1024 and 4096 bits long.
What keysize do you want? (2048) 2048

Please specify how long the key should be valid.
         0 = key does not expire
      <n>  = key expires in n days
      <n>w = key expires in n weeks
      <n>m = key expires in n months
      <n>y = key expires in n years
Key is valid for? (0) 0

Key does not expire at all
Is this correct? (y/N) y

You need a user ID to identify your key; the software constructs the user ID
from the Real Name, Comment and Email Address in this form:
    "Heinrich Heine (Der Dichter) <heinrichh@duesseldorf.de>"
    
Real name: Tester
Email address: tester@site.ru
Comment:
You selected this USER-ID:
    "Tester <tester@site.ru>"

Change (N)ame, (C)omment, (E)mail or (O)kay/(Q)uit? O
You need a Passphrase to protect your secret key.

Enter passphrase:
Repeat passphrase:

...
gpg: /home/testuser/.gnupg/trustdb.gpg: trustdb created
gpg: key 1D50BE34 marked as ultimately trusted
public and secret key created and signed.

gpg: checking the trustdb
gpg: 3 marginal(s) needed, 1 complete(s) needed, PGP trust model
gpg: depth: 0  valid:   1  signed:   0  trust: 0-, 0q, 0n, 0m, 0f, 1u
pub   2048R/1D50BE34 2019-02-26
      Key fingerprint = 13DA AA2E 9357 524B A03F  CC5B 6CD4 4B93 1D50 BE34
uid                  Tester <tester@site.ru>
sub   2048R/0820F082 2019-02-24
```
Теперь есть ключ с ID `1D50BE34`

Если появилась следующая ошибка
```
Not enough random bytes available.  Please do some other work to give
the OS a chance to collect more entropy! (Need 227 more bytes)
```
Устанавливаем пакет `sudo apt-get install rng-tools` и выполняем команду `sudo rngd -r /dev/urandom` и заново генерируем ключ.

Экспортируем публичный и приватный ключи
```
gpg –export -a "1D50BE34" > public.key

gpg –export-secret-key -a "1D50BE34" > private.key
```

Добавляем ключи в конфиг config/config.json
```
pubkey - публичный ключ из файла public.key
privkey - приватный ключ из private.key
passphrase - пароль, который указывали при генерации ключа
```
## Установка
Установка всех зависимостей из папки с файлами выполняем в терминале команду
```
npm install
npm test
```
Тестирование
 ```
npm test
```
## Запуск
Выполнить команду `npm start` запуститься вебсервер на порту, который указан в конфиге. 
По умолчанию это порт 3010.
