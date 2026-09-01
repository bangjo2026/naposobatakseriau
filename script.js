const wilayah = [
    "Pekanbaru",
    "Duri",
    "Dumai",
    "Kerinci / Pelalawan",
    "Siak",
    "Minas",
    "Kandis",
    "Bangkinang / Kampar",
    "Rengat / Indragiri Hulu",
    "Tembilahan / Indragiri Hilir",
    "Kuantan Singingi (Kuansing)",
    "Rohul (Rokan Hulu)",
    "Rohil (Rokan Hilir)",
    "Bengkalis"
];


const container =
    document.getElementById(
        "wilayahContainer"
    );


/* ===============================
   AMBIL DATA
=============================== */

function ambilData(index){

    let data;

    try{

        data =
        JSON.parse(
            localStorage.getItem(
                `anggota_${index}`
            )
        ) || [];

    }catch(error){

        data = [];

    }


    /*
    Mendukung data versi lama.

    Lama:
    ["Budi", "Andi"]

    Baru:
    [
      {
        nama:"Budi",
        usia:23
      }
    ]
    */

    return data
    .map(item => {

        if(
            typeof item === "string"
        ){

            return {
                nama:item,
                usia:""
            };

        }


        if(
            item &&
            typeof item === "object"
        ){

            return {

                nama:
                String(
                    item.nama || ""
                ),

                usia:
                item.usia !== undefined
                ?
                String(item.usia)
                :
                ""

            };

        }


        return null;

    })
    .filter(item =>
        item &&
        item.nama.trim() !== ""
    );

}


/* ===============================
   SIMPAN DATA
=============================== */

function simpanData(
    index,
    data
){

    localStorage.setItem(

        `anggota_${index}`,

        JSON.stringify(data)

    );

}


/* ===============================
   RENDER
=============================== */

function render(){

    container.innerHTML = "";


    wilayah.forEach(
        (namaWilayah,index)=>{

        const anggota =
            ambilData(index);


        const card =
            document.createElement(
                "section"
            );


        card.className =
            "card";


        card.style.animationDelay =
            `${index * .055}s`;


        card.innerHTML = `

            <div class="card-header">

                <div class="card-title">

                    <span class="pin">
                        ●
                    </span>


                    <div class="title-wrap">

                        <h2>
                            Wilayah
                            ${namaWilayah}
                        </h2>

                        <div
                            class="title-line">
                        </div>

                    </div>

                </div>


                <div class="badge">

                    <span>
                        👥
                    </span>

                    <span>
                        ${anggota.length}
                        Anggota
                    </span>

                </div>

            </div>


            <div class="input-area">

                <input
                    id="nama-${index}"
                    type="text"
                    autocomplete="off"
                    maxlength="80"
                    placeholder="Masukkan nama anggota"
                >


                <input
                    id="usia-${index}"
                    class="age-input"
                    type="number"
                    min="10"
                    max="100"
                    inputmode="numeric"
                    placeholder="Usia"
                >


                <button
                    class="add-btn"
                    type="button"
                    onclick="
                    tambahAnggota(${index})
                    "
                >

                    <span class="plus">
                        +
                    </span>

                    Tambah

                </button>

            </div>


            <ul class="member-list">

                ${
                    anggota.length === 0

                    ?

                    `
                    <li class="empty">
                        Belum ada anggota
                    </li>
                    `

                    :

                    anggota
                    .map(
                        (item,i)=>`

                        <li class="member-item">

                            <div class="member-info">

                                <span class="member-name">

                                    ${i + 1}.
                                    ${escapeHTML(
                                        item.nama
                                    )}

                                </span>


                                <span class="member-age">

                                    ${
                                        item.usia
                                        ?
                                        `${escapeHTML(item.usia)} Tahun`
                                        :
                                        "Usia belum diisi"
                                    }

                                </span>

                            </div>


                            <button
                                type="button"
                                class="delete-btn"
                                onclick="
                                hapusAnggota(
                                    ${index},
                                    ${i}
                                )
                                "
                            >
                                Hapus
                            </button>

                        </li>

                        `
                    )
                    .join("")
                }

            </ul>

        `;


        container.appendChild(
            card
        );


        const inputNama =
            document.getElementById(
                `nama-${index}`
            );


        const inputUsia =
            document.getElementById(
                `usia-${index}`
            );


        [
            inputNama,
            inputUsia

        ].forEach(input=>{

            input.addEventListener(
                "keydown",
                event=>{

                    if(
                        event.key ===
                        "Enter"
                    ){

                        tambahAnggota(
                            index
                        );

                    }

                }
            );

        });

    });

}


/* ===============================
   TAMBAH ANGGOTA
=============================== */

function tambahAnggota(index){

    const inputNama =
        document.getElementById(
            `nama-${index}`
        );


    const inputUsia =
        document.getElementById(
            `usia-${index}`
        );


    const nama =
        inputNama
        .value
        .trim();


    const usia =
        inputUsia
        .value
        .trim();


    if(!nama){

        alert(
            "Masukkan nama anggota."
        );

        inputNama.focus();

        return;

    }


    if(!usia){

        alert(
            "Masukkan usia anggota."
        );

        inputUsia.focus();

        return;

    }


    const usiaAngka =
        Number(usia);


    if(
        !Number.isInteger(
            usiaAngka
        ) ||
        usiaAngka < 10 ||
        usiaAngka > 100
    ){

        alert(
            "Usia harus berupa angka antara 10 sampai 100 tahun."
        );

        inputUsia.focus();

        return;

    }


    const anggota =
        ambilData(index);


    const sudahAda =
        anggota.some(
            item =>

            item.nama
            .trim()
            .toLowerCase()

            ===

            nama
            .toLowerCase()
        );


    if(sudahAda){

        alert(
            "Nama tersebut sudah ada di wilayah ini."
        );

        inputNama.focus();

        return;

    }


    anggota.push({

        nama:nama,

        usia:usiaAngka

    });


    simpanData(
        index,
        anggota
    );


    render();

}


/* ===============================
   HAPUS ANGGOTA
=============================== */

function hapusAnggota(
    wilayahIndex,
    anggotaIndex
){

    const anggota =
        ambilData(
            wilayahIndex
        );


    if(
        !anggota[
            anggotaIndex
        ]
    ){

        return;

    }


    const nama =
        anggota[
            anggotaIndex
        ].nama;


    const konfirmasi =
        confirm(
            `Hapus ${nama} dari daftar anggota?`
        );


    if(!konfirmasi){

        return;

    }


    anggota.splice(
        anggotaIndex,
        1
    );


    simpanData(
        wilayahIndex,
        anggota
    );


    render();

}


/* ===============================
   KEAMANAN TEXT
=============================== */

function escapeHTML(text){

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(text);


    return div.innerHTML;

}


/* ===============================
   START
=============================== */

render();