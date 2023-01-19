import { Vue, Component, Watch } from "vue-property-decorator";
export function resizeImage(settings: any): Promise<string> {
    const file = settings.file;
    const maxSize = settings.maxSize;
    const reader = new FileReader();
    const image = new Image();
    const canvas = document.createElement('canvas');
    const dataURItoBlob = (dataURI: string) => {
        const bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ?
            atob(dataURI.split(',')[1]) :
            unescape(dataURI.split(',')[1]);
        const mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const max = bytes.length;
        const ia = new Uint8Array(max);
        for (var i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i);
        return new Blob([ia], { type: mime });
    };
    const resize = (): string => {
        let width = image.width;
        let height = image.height;

        if (width > height) {
            if (width > maxSize) {
                height *= maxSize / width;
                width = maxSize;
            }
        } else {
            if (height > maxSize) {
                width *= maxSize / height;
                height = maxSize;
            }
        }

        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        context && context.drawImage(image, 0, 0, width, height);
        let dataUrl = canvas.toDataURL('image/jpeg');
        return dataUrl;
    };

    return new Promise((ok, no) => {
        if (!file.type.match(/image.*/)) {
            no(new Error("Not an image"));
            return;
        }

        reader.onload = (readerEvent: any) => {
            image.onload = () => ok(resize());
            image.src = readerEvent.target.result;
        };
        reader.readAsDataURL(file);
    })
};

export const placeHolderImageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAIAAABEtEjdAAAACXBIWXMAAAsTAAALEwEAmpwYAAAMKWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjarVd3UFP5Fv5uSQIhhBJAQEroTZQuRXoXFKTD2kISIJQQQoKK3XXZFVwLKhYsK7oq4qqrKyBrQSzYFsXuWh7qoqCsiwW78v4g4Jb3/ngz7zdz75z57ne+851z79yZA2jZC2SyfFIbKJAq5AmRIfy09Aw+6y7UoQEtMGErEBbLguPjY/GfDwG8ugYCAC47C2SyfPxvR0ckLhYCRDyATFGxsAAgfgJorlAmVwCMEwCspilkCoDRBUBPnpaeATA+ANDLTkvPAJjaAPQyB2JrAHrypIRQgOkNqHEEAnk2wA0DwC8RZisArgiAi1QkkQLclQAChDkCEcC9AmBEQUGhCNACAPvMP+lk/0Uzc0hTIMgeigd6AQCohUmKZfmCGfh/n4J85WANCwCcHHlUAgA9gFifVxiTAIADEHulmePjAOgCxCGJCFDFbTnKqGQVv0NYHJoBwAAgXooEYTEATACSrcxLDlbFtgI5MMAnQySK6CRVnCIvTFDpk7nS/PGxAzrkrBxx9GBcKS4OTxzkZEkiogFoA+SO0pyk1AGfZGOJJGU8AC5AnijOS4xR5V4qzQkdP8iRKxOSAVgDZFeWPCJhgENxCooH+6IshYLwRACGAOWhyEmKGsilYkXisPCBulSaWJqs8kPlyBQhCSp+qSw/PlaFV4rzIxMAWALU1uKSxMHcUwp5kmrO1LVcwdj4Ac/UY5kiPknl5w1iEYow8KEEH5koRC4kbT0NPeCrnkRAADmyIYazChnMSIUAckghQCJK8TukEKN4KC8EAsghRgmk+DiEDtydkQUB5CiBGMXIw0PIUUAb0wG0Hx1LB9BBdADtRnvTPoN5fK3BqsxwZhgzihnBdBjyIUQh8lEIOST/AYtBPsRQQg4xpIM9fNZjPGS0M+4zrjI6GDeRgt8gh2SQNUWyQP4353yMQweUqqmIkQkpugc5tC3tRnvSIbQ/HUD7gE8b0MZwpj1obzqYDqT9aE/a5y8OlUPePs/y7/XEkP6lHxXOdeR6qlxkDr2Z0CHW31VC/zQjEQoR83cm9Q21n2qljlFnqENUA/jUUaqROk8dphr+9CX8Bjmyh6olQAwp8pAPySDHpc6l2+XDP6oLVA7kEKMYUIinKwAgtFA2Qy7JzlHwg2WyfDE/WiocOYLv5uLqAaSlZ/AHfhkvDEAAIAzOfsaKmgGfcoDI/owJrICDDwHeq8+Y1XOAsww4fFGolJcMYDQAMMCGFvRgBDNYwR7OcIMX/BCEcIxFHJKQjskQIgcFkGMaZmE+ylCBZViFddiELdiBH7APDTiEYziFc7iIq7iFDnTiCXrxCu8JgmARmgSPMCLMCRvCiXAjvIkAIpyIJRKIdGIqkU1ICSUxi/iSqCAqiXXEZqKW+JE4SBwjzhDtxE3iHtFNPCfekRTJIfVIU9KWHEV6k8FkDJlETiKzySKylFxILiHXkDXkLrKePEaeI6+SHeQTso8CpUEZUBaUM+VNhVJxVAaVRcmpOVQ5VUXVULupJqqVukx1UD3UW5pJ82g+7Uz70VF0Mi2ki+g59GJ6Hb2DrqdP0Jfpe3Qv/YmhyTBhODF8GdGMNEY2YxqjjFHF2MY4wDjJuMroZLxiMpkGTDvmaGYUM52Zy5zJXMzcwNzDbGa2Mx8w+1gslhHLieXPimMJWApWGWstaxfrKOsSq5P1Rk1DzVzNTS1CLUNNqrZArUptp9oRtUtqj9Teq2ur26j7qsepi9RnqC9V36repH5BvVP9PVuHbcf2Zyexc9nz2WvYu9kn2bfZLzQ0NCw1fDQmaEg05mms0dircVrjnsZbji7HkRPKmchRcpZwtnOaOTc5LzQ1NW01gzQzNBWaSzRrNY9r3tV8w+VxR3KjuSLuXG41t557iftUS13LRitYa7JWqVaV1n6tC1o92urattqh2gLtOdrV2ge1r2v36fB0XHXidAp0Fuvs1Dmj06XL0rXVDdcV6S7U3aJ7XPcBj+JZ8UJ5Qt6XvK28k7xOPaaenV60Xq5ehd4Pem16vfq6+h76KfrT9av1D+t3GFAGtgbRBvkGSw32GVwzeDfMdFjwMPGwRcN2D7s07LXhcMMgQ7FhueEew6uG74z4RuFGeUbLjRqM7hjTxo7GE4ynGW80PmncM1xvuN9w4fDy4fuG/2pCmjiaJJjMNNlict6kz9TMNNJUZrrW9Lhpj5mBWZBZrtlKsyNm3eY88wBziflK86Pmj/n6/GB+Pn8N/wS/18LEIspCabHZos3ivaWdZbLlAss9lnes2FbeVllWK61arHqtza3HWc+yrrP+1Ubdxtsmx2a1TavNa1s721Tbr20bbLvsDO2i7Urt6uxu22vaB9oX2dfYX3FgOng75DlscLjoSDp6OuY4VjtecCKdvJwkThuc2kcwRviMkI6oGXHdmeMc7FziXOd8b6TByNiRC0Y2jHw6ynpUxqjlo1pHfXLxdMl32epyy1XXdazrAtcm1+dujm5Ct2q3K+6a7hHuc90b3Z95OHmIPTZ63PDkeY7z/NqzxfOj12gvuddur+7R1qOnjl4/+rq3nne892Lv0z4MnxCfuT6HfN76evkqfPf5/uHn7Jfnt9Ova4zdGPGYrWMe+Fv6C/w3+3cE8AOmBnwX0BFoESgIrAm8H2QVJAraFvQo2CE4N3hX8NMQlxB5yIGQ16G+obNDm8OosMiw8rC2cN3w5PB14XcjLCOyI+oieiM9I2dGNkcxomKilkddjzaNFkbXRveOHT129tgTMZyYxJh1MfdjHWPlsU3jyHFjx60Yd3u8zXjp+IY4xEXHrYi7E28XXxT/8wTmhPgJ1RMeJrgmzEpoTeQlTkncmfgqKSRpadKtZPtkZXJLilbKxJTalNepYamVqR1po9Jmp51LN06XpDdmsDJSMrZl9H0R/sWqLzonek4sm3htkt2k6ZPOTDaenD/58BStKYIp+6cypqZO3Tn1gyBOUCPoy4zOXJ/ZKwwVrhY+EQWJVoq6xf7iSvGjLP+syqyubP/sFdndOYE5VTk9klDJOsmz3KjcTbmv8+Lytuf156fm7ylQK5hacFCqK82Tnig0K5xe2C5zkpXJOop8i1YV9cpj5NuKieJJxY0KPYVMcV5pr/xKea8koKS65M20lGn7p+tMl04/P8NxxqIZj0ojSr+fSc8UzmyZZTFr/qx7s4Nnb55DzMmc0zLXau7CuZ3zIuftmM+enzf/lwUuCyoXvPwy9cumhaYL5y188FXkV3Vl3DJ52fWv/b7e9A39jeSbtkXui9Yu+lQuKj9b4VJRVfFhsXDx2W9dv13zbf+SrCVtS72WblzGXCZddm154PIdlTqVpZUPVoxbUb+Sv7J85ctVU1adqfKo2rSavVq5umNN7JrGtdZrl639sC5n3dXqkOo9603WL1r/eoNow6WNQRt3bzLdVLHp3XeS725sjtxcX2NbU7WFuaVky8OtKVtbv/f+vnab8baKbR+3S7d37EjYcaJ2dG3tTpOdS+vIOmVd966Juy7+EPZD427n3Zv3GOyp2Iu9yr2Pf5z647V9Mfta9nvv3/2TzU/rD/AOlNcT9TPqextyGjoa0xvbD4492NLk13Tg55E/bz9kcaj6sP7hpUfYRxYe6T9aerSvWdbccyz72IOWKS23jqcdv3Jiwom2kzEnT5+KOHW8Nbj16Gn/04fO+J45eNb7bMM5r3P15z3PH/jF85cDbV5t9RdGX2i86HOxqX1M+5FLgZeOXQ67fOpK9JVzV8dfbb+WfO3G9YnXO26IbnTdzL/57NeSX9/fmnebcbv8jvadqrsmd2v+5fCvPR1eHYfvhd07fz/x/q0HwgdPfiv+7UPnwoeaD6semT+q7XLrOtQd0X3x8RePO5/InrzvKftd5/f1T+2f/vRH0B/ne9N6O5/Jn/U/X/zC6MX2lx4vW/ri++6+Knj1/nX5G6M3O956v219l/ru0ftpH1gf1nx0+Nj0KebT7f6C/n6ZQC4AAFAAyKws4Pl2QDMd4F0E2NyBnUu1KxKft8b/Fg/sZQAAL2B7EJA8D4htBjY2AzbzAE4zEA8gKQiku/vQpTrFWe5uA1ocOcB409//whRgNQEf5f397zf093/cClA3geaigV0PGNghv+MBwLnpgn/sXP8GQmJptQYlbzwAAAAgY0hSTQAAbXUAAHOgAAD83QAAg2QAAHDoAADsaAAAMD4AABCQ5OyZ6gAAED5JREFUeNrs3ftbU3eewPETCaK1rbVarPWxterYbqfazrMznXY6287ss7v/8k6rclEQUEQuXgARw00lghJIyO3knP1hduzY8W5CLrxeP1o5DZ9veBtOTr4nsbS0FADQWnYYAYC4AyDuAIg7AOIOgLgDiDsA4g6AuAMg7gCIO4C4AyDuAIg7AOIOgLgDIO4A4g6AuAMg7gCIOwDiDiDuAIg7AOIOgLgDIO4AiDuAuAMg7gCIOwDiDoC4A4g7AOIOgLgDIO4AiDsA4g4g7gCIOwDiDoC4AyDuAOIOgLgDIO4AiDsA4g6AuAOIOwDiDoC4AyDuAIg7gLgDIO4AiDsA4g6AuAMg7gDiDoC4AyDuAIg7AOIOIO4AiDsA4g6AuAMg7gCIO4C4AyDuAIg7AOIOgLgDiDsA4g6AuAMg7gCIOwDiDiDuAIg7AOIOgLgDIO4A4g6AuAMg7gCIOwDiDoC4A4g7AOIOgLgDIO4AiDuAuAMg7gCIOwDiDoC4AyDuAOIOgLgDIO4AiDsA4g4g7gCIOwDiDoC4AyDuAIg7gLgDIO4AiDsA4g6AuAOIOwDiDoC4AyDuAIg7AOIOIO4AiDsA4g6AuAMg7gDiDoC4AyDuAIg7AOIOgLgDiDsA4g6AuAMg7gCIO4C4AyDuAIg7AOIOgLgDIO4A4g6AuAMg7gCIOwDiDiDuAIg7AOIOgLgDIO4AiDuAuAMg7gCIOwDiDsALJI2gWcRxHIahOVDnZLQlEzsS5iDuVM3Gxkb3uS5zoL6++faPhw4dMofG57QMgLgDIO4AiDsA4g6AuAOIOwDiDoC4AyDuAIg7gLgbAYC4AyDuAIg7AFVhP/ftscztyV0du4JEkGxra0s2+qLHcRCG5SAI4iiOg7gW/4udO3cmEonGWJr2HYktfY1ViSq5bDaXzfm5EHea2MnPTv7m5Mlk0kLzZOIrlYX5+bHRMaNoVU7LtLL2ne3/9sUXys6/amtrO/rppydO/sYoxJ3mc/DgQUPgOY4fP24I4k7z2bV7tyHwvGfIrl1tyTZzEHea71dvQ+D5Ojo6DEHcgdZ7BeAtGXEHWk5jXBGKuAMg7gDiDoC4AyDuQAOqhKEhiDvQamIjEHcAxB0AcQdA3AEQdwBxB0DcAWg0dvtkS8VxvLi4eHdpKZPJlEqlKIqCOEgkEsn25J49ez7o7Dx69Ohu9xgBcadZFAqFsdHR5eXlOIr/tfilYqlULD16+Gh6curtd94+dfp0Z2enoYG409Cv1sfHxuZSc3H8Uh+HzG5kB/ovvrdv33fffbvTfYLgtTjnTm3l8/mf/vdvqTuplyz7Y2uPHv3888+rq6tmCOJOY1lbWzt75kyxWHy9L6+Elf6+vvRy2iRB3GkUuVzuQu/5qBK9yUHiKB4aHFhfXzdPEHfqL4qi3p6eKIqqcaj4Yl9fVQ4F4g5v5PKlS+VSuVpHKxZL1yYmTBXEnXrKZDL3792v7jFTqVS5XDZbEHfq5uqVkaofM47i6akpswVxpz5KpVJmPVOLIy8tLhkviDv1kUqlanTrtnw+XygUTBjEnTpYvn+/dgdPp13zDuJOPeSyudodfGNjw4RB3KmDSqVSu4MXC0UTBnGnDuIanXEPgiAIfJQJxJ06PaV21PBJlWy3jymIO/Wwa1cNb7Xx1u63TBjEnTp4//19tTv4vn37TBjEnTo48vHHtXqy7tix/8B+EwZxpw7279/fvrO9Jkc+sL+mJ/T/WalU6rtwwfu3iDv84uTJk7U47PHjx7fsW7h27drqyurQ4KDVRNzhHxU+cWLnzp3VPeY777x98MMPt+bx5/P5xfmFIAjSy+kJWw0j7vB3iUTiD3/8prrHPP3111v2+K8MDz++4+vszO2FhQVrirhDEATBgQMHjp+o2lmUIx9/fODAga155Hfv3l1deeKu3FdHRtbW1lp1pd7wPoiIO9vOl6dOdXZ2vvlx3t377te/26KX7blc7srly7/6wziK+/v6X/s23w2uElU8V8UdXs23f/rug84P3uQIb+156/s//3lrLpIpFos9Xd1R9JTtE8Jyue+8i2cQdwiCIAgSicSfvv/+k6NHX+/L9+7d++Nf/lL192afKgzDrnPnwjB81l/IZrMunkHc4Rdf/+7rP3zzTbL9VS5+TwRHPz36w19+3JqyR1HU3dVVKpae/9fSy+nr165ZUJqCbZjYCh8d/qjzYOeN69fnUnMvPLnx/v73T50+/d57723Zwzvf27uZ23yZvzlza+bdvXuPHDliTRF3CIIgSCaTp7/66ovf/nYulVpaWspkMr+6TmPX7l2dnZ3Hjh/fu3fvVj6wgYsXM2uvcNPXqyMj77zzzlb+2wPiThMk/viJE8dPnAiCIJfL5fP5KIo6Ojr27NmTTNbh2Xh1ZCS9/Gq37oujuP9C33/9z393dHRYUBqWc+7UzZ49ew4cONDZ2bl37966lP3mjRvzc/Ov8YVhGJ7v6XXxDOIODWd2dnZ6avq1v3xzc3NgYMAYEXdoIEtLSxPj4294kJX0AzvPIO7QKFZXVq5cHq7KrV7tPIO4Q0NYX1/v7+9/vC/Ym2vtnWcQd2gC+Xz+fE9vHMVVPGZr7zyDuEOjK5fLXV1dlUr198kKy+Xenp6nHrlQKNy7e9dLe7ae69zZFqIoOnf2bFgq1+p3gs18b2/vDz/88PiaznQ6PT46lsvl/v8nrT355alTn3zyibVA3KE64jju7uoqFmp75mQjs/7T3346dOjQjrYdD9LpX+1nEJbD0ZGrmbW10199ZUUQd6iCvvPnsxvZLfgfheXywvzzPhV1Z/ZOR0fHZ59/blGoNefcaXGXBocePnzUOI9ncnLSKXjEHd7I2OjovXv3GusxxcHQwGB1r9gBcWcbmZycTN1JNeADKxQKY+NjFghxh1eWSqWmbk427MObS6WcnEHc4dXcu3dvbHS0oR9iHFwaHKziB2VB3GlxKw9WLg0NBQ2fzXy+4KZ9iDu8lPX19YsX+4MmeUE8e3t2PZOxaog7PP+1cPW3jqmpOI4HB5ycQdzh2crlcte5c7XYOqbW/yBN3rxp+RB3eIowDM+dOROWw2Z88Ldu3drY2LCIiDs8IY7jnq6uYrHUrI8/iocGB60j4g5P6OnuyT25S1fTyWVzTs4g7vCLi/39rXHByfTUdNbJGcQdgiAYvnz5QfpBa3wvcRwPDQ1ZU8Sd7e7axMTS4lIrfUfZjezU5JSVRdzZvqanp2/P3G6972tqavLxzZtA3Nle5ubmbl6/0ZLfWhzFQ4NOziDubD/L9++PXr3awt/gxvr69NS0hUbc2UZWV1eHBoeCVv+4/tTkZH4zb7kRd7aFjY2N/r6+7bATSxRFgz7WhLizHeSy2d7unu1zd7r1TOb2zIx157UljYAtszA/PzMzs5nPJ4Jg9+7dhw8f/vTYsfb29heXPZfr7upuuk3B3tCNGzc+Onx49+7dnjmIO436ujuX67twoZAvPP6Tcqm8nlmfmpw8cuTjL0+fSiaf+VRMLy8PDm7HO0pHlWhwYPCv//lXzx/EnUb0nDpHUTw3N7e4tHjs2LHPPv+8ra3tn/9rHMVj42NzqVSwXTc8X89k7szOfnrsmGcR4k6DlT2dfuH9KCph5db0rZmZmf3v7//w0Id73n67WCzev3cvnU5HlWibD/D6tesfHT7c0dHhuYS40ygePXo0ODDwkte3xFG8srKysrJibk/8y1epXBoc/I8ffzQKXomrZaiVXDZ74fz5bXiuvOoePnyUSqXMAXGn/vL5fHd3t7JXy8T4eLFYNAfEnXoql8vdXV2VsGIU1RJVouHLl2tx5OSTb2Ij7vCMDEXRubNny6WyUVTXyoOV+bn5qh82sUMExB1eJI7j7q6uYsEJhJoYHx8rlUrmgLiz1c739GY3suZQI5WwUqOTM4g7PNPAxYG1tTVzqKkH6QcLCwvmgLizRUaGr6SXl81hC4yPjpbL3tJA3Km9ifFxLye3TBhWhoeHzQFxp7YmJydnb8+aw1ZK31++e/euOSDu1Mrs7OzUzUlz2HpXr14Nw9AcEHeqb2F+YWJ83BzqIiyVXTmDuFN9y/fvj4xcCewvUM8lWE6n0+aAuFM1qysrQ0NDyl53w5cvOzmDuFMdmUymv7/fpmCNoFwqj42OmgPizpvKZbPne3uVvXEsLiw+SD8wB8Sd11coFHq6u90dqdEMX74cRRYFcef1zgCUy+fOngtt5Nt4SqXS+OiYOSDuvLIwDM+eORP61Hujmpufe/jwoTkg7ryCv2/RXirabLaBxcGlwSEnZxB3Xjoacdzd1VXIF4yiwRWLxWsTE+aAuPNSerp7bNHeLO7cubP26JE5IO68QN+FC+uZjDk0z+9ZwaVLl+LYhaqIO882ODC4urJqDs0lv5m/fu26OSDuPN3IlSvL9++bQzOavX17Y2PDHMQdfm1ifHxh3s03mlUcx0ODQ+Yg7vAEN99oAbls9vbMjDmIO/zjN3o332gVN2/etGGkuEMQBMHS4tLEmJtvtIhKWLFhpLhDEIbhlStuu9xSFhcXvbMq7mx3w8PDNvJtNXFw9cqIMWxPSSMgCII4jtuTyYMffphIGEbLrGkQJIL2ZLJcLre3txuIuLMdJRKJf//9780BWobTMgDiDoC4Aw2ura3NEMQdaDUJ76GLOwDiDoC4AyDuAIg78HTuySfuQAuqVCqGIO40mcjPLS9SLBYNQdxpMpubeUPgOQqFQiX0CkDcaTbL6WVnVHmO2du3DUHcaT5hqTw+Nl4qlYyCXz83wvDW9K1b07eMolXZ8rfFpe7cSd25k0wmd+7cGSQSOxKJtqS9RH4JXLP8YpNIBMnkS/20tieTiR3Pe9EWx/Hm5ubm5mbglzpxpwUq5l7JsK04LQMg7gCIOwDiDoC4AyDuAOIOgLgDIO4AiDsA4g4g7kYAIO4AiDsA4s5zJBIJQ6D+yfA8bJZiLC0tmQKAV+4AiDsA4g6AuAMg7gDiDoC4AyDuAIg7AOIOIO4AiDsA4g6AuAMg7gCIO4C4AyDuAIg7AOIOgLgDiDsA4g6AuAMg7gCIOwDiDiDuAIg7AOIOgLgDIO4A4g6AuAMg7gCIOwDiDoC4A4g7AOIOgLgDIO4AiDuAuAMg7gCIOwDiDoC4AyDuAOIOgLgDIO4AiDsA4g4g7gCIOwDiDoC4AyDuAIg7gLgDIO4AiDsA4g6AuAOIOwDiDoC4AyDuAIg7AOIOIO4AiDsA4g6AuAMg7gDiDoC4AyDuAIg7AOIOgLgDiDsA4g6AuAMg7gCIO4C4AyDuAIg7AOIOgLgDIO4A4g6AuAMg7gCIOwDiDiDuAIg7AOIOgLgDIO4AiDuAuAMg7gCIOwDiDoC4A4g7AOIOgLgDIO4AiDsA4g4g7gCIOwDiDoC4AyDuAOIOgLgDIO4AiDsA4g6AuAOIOwDiDoC4AyDuAIg7gLgDIO4AiDsA4g6AuAMg7gDiDoC4AyDuAIg7AOIOIO4AiDsA4g6AuAMg7gCIO4C4AyDuAIg7AOIOgLgDiDsA4g6AuAMg7gCIOwDiDiDuAIg7AOIOgLgDIO4A28z/DQClXppK7ETGBAAAAABJRU5ErkJggg==";
export const placeHolderTextImageBase64 = "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";

export enum EventType {
    StartWaiting = "startWaiting",
    EndWaiting = "endWaiting",
    Login = "login",
    RequestCount = "requestCount",
}

export enum ResponseType {
    Ok,
    Failed,
    ValidationFailed,
    Warning,
    SessionExpired,
    Notification
}

export enum OperationType {
    Add,
    Modify,
    Remove,
}

const notificationTypes = ["success", "error", "error", "warning", "error", "info" ];

export function getNotificationType(responseType: ResponseType) {
    return notificationTypes[responseType];
}

export function generateCustomValidity(target: HTMLElement) {
    const label = document.querySelector(`label[for='${target.id}']`) as HTMLLabelElement;
    const description = label ? label.textContent : "";
    //if (target.validity.stepMismatch)
    //    return `${description} باید مضربی از ${target.getAttribute("step")} باشد`;
    //else
    return `${description} ${window.MessagesLibrary.get("IsInvalid")}`;
}

function grgIsLeap(Year: number) {
    return Year % 4 == 0 && (Year % 100 != 0 || Year % 400 == 0);
}

function hshIsLeap(Year: number) {
    Year = (Year - 474) % 128;
    Year = (Year >= 30 ? 0 : 29) + Year;
    Year = Year - Math.floor(Year / 33) - 1;
    return Year % 4 == 0;
}

export function convertToPersianDate(date: Date) {
    const grgYear = date.getFullYear();
    const grgMonth = date.getMonth() + 1;
    const grgDay = date.getDate();
    var hshYear = grgYear - 621;
    var hshMonth, hshDay;
    var grgLeap = grgIsLeap(grgYear);
    var hshLeap = hshIsLeap(hshYear - 1);
    var hshElapsed;
    const grgSumOfDays = Array(
        Array(0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365),
        Array(0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366)
    );
    const hshSumOfDays = Array(
        Array(0, 31, 62, 93, 124, 155, 186, 216, 246, 276, 306, 336, 365),
        Array(0, 31, 62, 93, 124, 155, 186, 216, 246, 276, 306, 336, 366)
    );
    var grgElapsed = grgSumOfDays[grgLeap ? 1 : 0][grgMonth - 1] + grgDay;
    var XmasToNorooz = hshLeap && grgLeap ? 80 : 79;
    if (grgElapsed <= XmasToNorooz) {
        hshElapsed = grgElapsed + 286;
        hshYear--;
        if (hshLeap && !grgLeap) hshElapsed++;
    } else {
        hshElapsed = grgElapsed - XmasToNorooz;
        hshLeap = hshIsLeap(hshYear);
    }
    for (var i = 1; i <= 12; i++) {
        if (hshSumOfDays[hshLeap ? 1 : 0][i] >= hshElapsed) {
            hshMonth = i;
            hshDay = hshElapsed - hshSumOfDays[hshLeap ? 1 : 0][i - 1];
            break;
        }
    }
    return `${hshYear}/${(hshMonth || 1).toString().padStart(2, "0")}/${(hshDay || 1).toString().padStart(2, "0")}`;
}

export function hasAccess(id: number, callback: any) {

    //@ts-ignore
    if (window.accessIds != null) {
        //@ts-ignore
        var hasAccess = window.accessIds.indexOf(Number(id)) != -1;
        callback(hasAccess);
    } else {
        callback(false);
    }
}

//export function webViewTypeItems(callback: any) {
//    let webViewTypeItems: string[] = [];
//    $.ajax({
//        type: "POST",
//        url: "/api/Home/WebViewTypes",
//        dataType: "json",
//        success: result => {
//            if (result != null) {
//                var items = result.split(',');
//                items.forEach((value: any) => {
//                    webViewTypeItems.push(value.split(':'));
//                });

//                callback(webViewTypeItems);
//            }
//        }
//    })
//}

export function webViewType(item:string) {
    return window.webViewTypes.find((element:any) => {
        if (element.indexOf(item) == 0) {
            return element;
        };
    })[1];
}

export class Entity {
    Id!: number;
    Name!: string;
}

export class WorkingYear extends Entity {
    IsDefultYear!: boolean;
}

export class Period extends Entity {
    WorkingYearId!: number;
    StartDateText!: string;
    StopDateText!: string; 
}

export enum SelectEmployeeFilterType {
    All = 0,
    OnlyCurrentlyEmployed = 1,
    ByPeriodDateEmployed = 2,
    ByPeriodAndVacationTypeEmployed = 3,
    ByLastHourOfWorkDay = 4,
    SelectedEmployeeByWorkingYear = 5
}

export enum RequestState {
    Registerd = 0,
    AlternatePending = 1,
    Confirmed = 2,
    Refused = 3,
    SwapPending = 4,
    Pending = 5
}

export const timeRangeTypes = {
    Presence : 0,
    Vacation : 1,
    Mission : 2,
    Absence : 3,
    Incomplete : 4,
    IncompleteByNoCheckIn : 5,
    DailyExtraWorkPermission : 6,
    DailyExtraWorkPermissionHourly : 7,
}

export function hourMinToMin(input: string) {
    var arr = String(input).split(":");
    var hour = (!arr[0] ? 0 : arr[0]) as number;
    var min = (!arr[1] ? 0 : arr[1]) as number;
    var result = Math.round(hour) * 60 + Math.round(min);
    return result;
};

export enum VacationKind {
    Hourly = 0,
    Daily = 1,
}

export enum MissionType {
    Hourly = 0,
    Daily = 1,
}

export class Employee extends Entity {
    EmploymentTypeId?: number;
}

export enum WorkgroupType {
    //[Description(@"عادی کار")]
    NormalWorking,
    //[Description(@"شیفت کار")]
    ShiftWorking,
    //[Description(@"نوبت کار")]
    SequenceWorking,
    //[Description(@"ساعت کار")]
    HourlyWorking,
    //[Description(@"مدیریتی")]
    ManagerWorking,
    //[Description(@"ساعت کار موظفی")]
    HourlyBoundWorking,
}

export function getUserInfo(callback?: any) {

    $.ajax({
        type: "POST",
        url: "/api/Home/GetUserInfo",
        dataType: "json",
        success: result => {
            if (result != null) {
                callback && callback(result);
                Vue.prototype.$UserInfo = result;
                //@ts-ignore
                window.access = result.Access;
            }
        },
        complete: () => {

        }
    });
}

export function getCurrentDate(callback?: any) {

    $.ajax({
        type: "POST",
        url: "/api/Home/GetCurrentDate",
        dataType: "json",
        success: result => {
            if (result != null) {
                callback && callback(result);
                Vue.prototype.$dateObject = result;
            }
        },
        complete: () => {

        }
    });
}

export function getIsAutomaticLoadChartData(callback?: any) {

    $.ajax({
        type: "POST",
        url: "/api/Shared/GetIsAutomaticLoadChartData",
        dataType: "json",
        success: result => {
            if (result != null) {
                callback && callback(result);
                Vue.prototype.$isAutomaticLoadChartDataObject = result;
            }
        },
        complete: () => {

        }
    });
}

export function getContractValidity(callback?: any) {
    $.ajax({
        type: "POST",
        url: "/api/Account/ValidateContract",
        dataType: "json",
        success: result => {
            if (result != null) {
                callback && callback(result);
                Vue.prototype.$contractObject = result;
            }
        },
        complete: () => {

        }
    });
}

export function addToShareholderWatch(shrhCode: string, shareholderWatchIds: never[], callback?: any) {

    $.ajax({
        type: "POST",
        url: "/api/Shared/AddShareholderToSelectedWatches",
        data: {
            watchShareholderIds: shareholderWatchIds,
            shrhCode: shrhCode
        },
        dataType: "json",
        success: result => {
            callback && callback(result);
            return result;
            //if (result.ResponseType === ResponseType.Ok) {
            //    //@ts-ignore
            //    this.$root.$children[0].popupNotificationWidget.show(result.Message, getNotificationType(result.ResponseType));
            //} else {
            //    //@ts-ignore
            //    this.$root.$children[0].popupNotificationWidget.show(result.Message, getNotificationType(result.ResponseType));
            //}

        },
        complete: () => {
            window.app.$emit(EventType.EndWaiting);
        }
    });
}

export function formatNumber(num: number) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g,'$1,')
}

export function checkShrhCodeValidity(shrhCode: string,callback?: any) {

    $.ajax({
        type: "POST",
        url: "/api/Shared/CheckShrhCodeValidity",
        dataType: "json",
        data: {
            shrhCode: shrhCode
        },
        success: result => {
            if (result != null) {
                callback && callback(result);
                return result;
            }
        },
        complete: () => {

        }
    });
}

export function getOsType() {

    var osType = "0";

    if (navigator.userAgent.indexOf("Win") != -1) osType =
        "1";
    if (navigator.userAgent.indexOf("Mac") != -1) osType =
        "2";
    if (navigator.userAgent.indexOf("Linux") != -1) osType =
        "3";
    if (navigator.userAgent.indexOf("Android") != -1) osType =
        "4";
    if (navigator.userAgent.indexOf("like Mac") != -1) osType =
        "5";

    return osType;
};

export function onlyUnique(value: any, index: any, self: any) {
    return self.indexOf(value) === index;
}

export function getBrowserType() {

    var browserType = "0";
    if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
        browserType = "1";
    }
    else if (navigator.userAgent.indexOf("Chrome") != -1) {
        browserType = "2";
    }
    else if (navigator.userAgent.indexOf("Safari") != -1) {
        browserType = "3";
    }
    else if (navigator.userAgent.indexOf("Firefox") != -1) {
        browserType = "4";
    }
    else if ((navigator.userAgent.indexOf("MSIE") != -1)) {
        browserType = "5";
    }
    else {
        browserType = "0";
    }

    return browserType;
};

export function getDeviceType() {

    var deviceType = "3";

        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            deviceType = "1"; //tablet
        }
        if (
            /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
                ua
            )
        ) {
            deviceType = "2"; //mobile
        }
    deviceType = "3"; //desktop


    return deviceType;
};

export function generateTimerCountUp(countUpDate:number): string {

    // Get todays date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = countUpDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)) + 1;
    var seconds = Math.floor((distance % (1000 * 60)) / 1000) + 1;

    // Display the result in the element with id="demo"
    var result = ('0' + Math.abs(minutes)).slice(-2) + ":" + ('0' + Math.abs(seconds)).slice(-2);

    return result;
};

export function saveReportToCache(model: {}, data: [], cacheName: string) {
    var cacheModel = {
        model: {},
        data: []
    }
    cacheModel.data = data;
    cacheModel.model = model;
    localStorage.setItem(cacheName, JSON.stringify(cacheModel));
};

export class ReportCache {
    Model!: any;
    DataSource!: kendo.data.DataSource;
    ChartDataSource!: kendo.data.DataSource;
    Date!: string
}

export function readReportFromCache(cacheName: string) {

    var cacheItem = localStorage.getItem(cacheName);
    if (cacheItem != null) {
        //@ts-ignore
        var jsonCache = JSON.parse(cacheItem)

        var dataSource = new kendo.data.DataSource({
            pageSize: 500,
            data: jsonCache.data
        });
        var cacheObject = new ReportCache();
        cacheObject.DataSource = dataSource;
        cacheObject.Model = jsonCache.model;

        localStorage.removeItem(cacheName);

        return cacheObject;
    } else {
        return false;
    }
}

export function saveReportToBasePageCache(model: {}, cacheName: string) {
    var cacheModel = new ReportCache();
    cacheModel.Model = model;
    var today = new Date();
    cacheModel.Date = convertToPersianDate(today);
    localStorage.setItem(cacheName, JSON.stringify(cacheModel));
}

export function readReportFromBasePageCache(cacheName: string) {

    var cacheItem = localStorage.getItem(cacheName);
    var today = new Date();
    if (cacheItem != null) {
        //@ts-ignore
        var jsonCache = JSON.parse(cacheItem)

        var dataSource = new kendo.data.DataSource({
            pageSize: 2,
            data: jsonCache.Model.dataList?.options.data
        });

        var chartDataSource = new kendo.data.DataSource({
            data: jsonCache.Model.dataList?.options.data
        });

        var cacheObject = new ReportCache();

        cacheObject.Model = jsonCache.Model;
        cacheObject.DataSource = dataSource;
        cacheObject.ChartDataSource = chartDataSource;

        if (jsonCache.Date !== convertToPersianDate(today)) {
            localStorage.removeItem(cacheName);
            return false;
        }
        
        return cacheObject;

    } else {
        return false;
    }
}

export function saveReportToSmartAssistantCache(model: {}, cacheName: string) {
    var cacheModel = new ReportCache();
    cacheModel.Model = model;
    localStorage.setItem(cacheName, JSON.stringify(cacheModel));
}

export function readReportFromSmartAssistantCache(cacheName: string) {
    var cacheItem = localStorage.getItem(cacheName);
    if (cacheItem != null) {
        //@ts-ignore
        var jsonCache = JSON.parse(cacheItem)

        var cacheObject = new ReportCache();
        cacheObject.Model = jsonCache.Model;

        localStorage.removeItem(cacheName);

        return cacheObject;
    } else {
        return false;
    }
}