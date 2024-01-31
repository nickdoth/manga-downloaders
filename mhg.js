var LZString = (function () {
    var f = String.fromCharCode;
    var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var baseReverseDic = {};
    function getBaseValue(alphabet, character) {
        if (!baseReverseDic[alphabet]) {
            baseReverseDic[alphabet] = {};
            for (var i = 0; i < alphabet.length; i++) {
                baseReverseDic[alphabet][alphabet.charAt(i)] = i
            }
        }
        return baseReverseDic[alphabet][character]
    }
    var LZString = {
        decompressFromBase64: function (input) {
            if (input == null)
                return "";
            if (input == "")
                return null;
            return LZString._0(input.length, 32, function (index) {
                return getBaseValue(keyStrBase64, input.charAt(index))
            })
        },
        _0: function (length, resetValue, getNextValue) {
            var dictionary = [], next, enlargeIn = 4, dictSize = 4, numBits = 3, entry = "", result = [], i, w, bits, resb, maxpower, power, c, data = {
                val: getNextValue(0),
                position: resetValue,
                index: 1
            };
            for (i = 0; i < 3; i += 1) {
                dictionary[i] = i
            }
            bits = 0;
            maxpower = Math.pow(2, 2);
            power = 1;
            while (power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                    data.position = resetValue;
                    data.val = getNextValue(data.index++)
                }
                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1
            }
            switch (next = bits) {
                case 0:
                    bits = 0;
                    maxpower = Math.pow(2, 8);
                    power = 1;
                    while (power != maxpower) {
                        resb = data.val & data.position;
                        data.position >>= 1;
                        if (data.position == 0) {
                            data.position = resetValue;
                            data.val = getNextValue(data.index++)
                        }
                        bits |= (resb > 0 ? 1 : 0) * power;
                        power <<= 1
                    }
                    c = f(bits);
                    break;
                case 1:
                    bits = 0;
                    maxpower = Math.pow(2, 16);
                    power = 1;
                    while (power != maxpower) {
                        resb = data.val & data.position;
                        data.position >>= 1;
                        if (data.position == 0) {
                            data.position = resetValue;
                            data.val = getNextValue(data.index++)
                        }
                        bits |= (resb > 0 ? 1 : 0) * power;
                        power <<= 1
                    }
                    c = f(bits);
                    break;
                case 2:
                    return ""
            }
            dictionary[3] = c;
            w = c;
            result.push(c);
            while (true) {
                if (data.index > length) {
                    return ""
                }
                bits = 0;
                maxpower = Math.pow(2, numBits);
                power = 1;
                while (power != maxpower) {
                    resb = data.val & data.position;
                    data.position >>= 1;
                    if (data.position == 0) {
                        data.position = resetValue;
                        data.val = getNextValue(data.index++)
                    }
                    bits |= (resb > 0 ? 1 : 0) * power;
                    power <<= 1
                }
                switch (c = bits) {
                    case 0:
                        bits = 0;
                        maxpower = Math.pow(2, 8);
                        power = 1;
                        while (power != maxpower) {
                            resb = data.val & data.position;
                            data.position >>= 1;
                            if (data.position == 0) {
                                data.position = resetValue;
                                data.val = getNextValue(data.index++)
                            }
                            bits |= (resb > 0 ? 1 : 0) * power;
                            power <<= 1
                        }
                        dictionary[dictSize++] = f(bits);
                        c = dictSize - 1;
                        enlargeIn--;
                        break;
                    case 1:
                        bits = 0;
                        maxpower = Math.pow(2, 16);
                        power = 1;
                        while (power != maxpower) {
                            resb = data.val & data.position;
                            data.position >>= 1;
                            if (data.position == 0) {
                                data.position = resetValue;
                                data.val = getNextValue(data.index++)
                            }
                            bits |= (resb > 0 ? 1 : 0) * power;
                            power <<= 1
                        }
                        dictionary[dictSize++] = f(bits);
                        c = dictSize - 1;
                        enlargeIn--;
                        break;
                    case 2:
                        return result.join('')
                }
                if (enlargeIn == 0) {
                    enlargeIn = Math.pow(2, numBits);
                    numBits++
                }
                if (dictionary[c]) {
                    entry = dictionary[c]
                } else {
                    if (c === dictSize) {
                        entry = w + w.charAt(0)
                    } else {
                        return null
                    }
                }
                result.push(entry);
                dictionary[dictSize++] = w + entry.charAt(0);
                enlargeIn--;
                w = entry;
                if (enlargeIn == 0) {
                    enlargeIn = Math.pow(2, numBits);
                    numBits++
                }
            }
        }
    };
    return LZString
}
)();

String.prototype.splic = function (f) {
    return LZString.decompressFromBase64(this).split(f)
};

const path = require("node:path");
const fs = require("node:fs/promises");

const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0";
const pageUrl = process.argv[2]; // "https://tw.manhuagui.com/comic/51199/737805.html"
const imgServer = "https://us.hamreus.com";

fetch(pageUrl, {
    headers: {
        "User-Agent": ua,
        "Referer": "https://tw.manhuagui.com/",
    }
})
    .then(res => res.text())
    .then(text => text.match(/window\["\\x65\\x76\\x61\\x6c"](((?!<\/script>).)*)<\/script>/))
    .then(matches => "(n => n)" + matches[1].trim())
    .then(eval)
    .then(data => data.match(/SMH\.imgData\((.*)\)\.preInit/)[1].trim())
    .then(JSON.parse)
    .then(async (data) => {
        console.log(data);
        const folderPath = path.join('./mangas/', data.bname, data.cname);
        await fs.mkdir(folderPath, { recursive: true });

        for (const filename of data.files) {
            const fileUrl = imgServer + data.path + filename + `?e=${data.sl.e}&m=${data.sl.m}`;
            const filePath = path.join(folderPath, filename);
            console.log("Downloading", fileUrl);
            console.log("Save to", filePath);
            await fetch(fileUrl, {
                headers: {
                    "User-Agent": ua,
                    "Referer": pageUrl,
                },
            }).then(res => res.arrayBuffer())
                .then(buf => fs.writeFile(filePath, new Uint8Array(buf)));

            await new Promise(resolve => setTimeout(resolve, 2000 + Math.floor(1000 * Math.random())));
        }
    })
    ;


