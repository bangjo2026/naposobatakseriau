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
    document.getElementById("wilayahContainer");

let semuaAnggota = [];


/* =====================================
   AMBIL DATA DARI FIRESTORE
===================================== */

function ambilDataFirestore() {

    db.collection("anggota")
        .orderBy("dibuatPada", "asc")
        .onSnapshot(

            snapshot => {

                semuaAnggota = [];

                snapshot.forEach(doc => {

                    semuaAnggota.push({
                        id: doc.id,
                        ...doc.data()
                    });

                });

                render();

            },

            error => {

                console.error(
                    "Gagal mengambil data:",
                    error
                );

                container.innerHTML = `
                    <div style="
                        text-align:center;
                        padding:40px 20px;
                        color:#ffd46b;
                    ">
                        Gagal memuat data anggota.
                    </div>
                `;

            }

        );

}


/* =====================================
   TAMPILKAN SEMUA WILAYAH
===================================== */

function render() {

    container.innerHTML = "";

    wilayah.forEach((namaWilayah, index) => {

        const anggotaWilayah =
            semuaAnggota.filter(item =>
                item.wilayah === namaWilayah
            );

        const card =
            document.createElement("section");

        card.className = "card";

        card.style.animationDelay =
            `${index * 0.055}s`;

        card.innerHTML = `

            <div class="card-header">

                <div class="card-title">

                    <span class="pin">
                        ●
                    </span>

                    <div class="title-wrap">

                        <h2>
                            Wilayah ${escapeHTML(namaWilayah)}
                        </h2>

                        <div class="title-line"></div>

                    </div>

                </div>


                <div class="badge">

                    <span>👥</span>

                    <span>
                        ${anggotaWilayah.length} Anggota
                    </span>

                </div>

            </div>


            <div class="input-area">

                <input
                    id="nama-${index}"
                    type="text"
                    maxlength="80"
                    autocomplete="off"
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
                    type="button"
                    class="add-btn"
                    onclick="tambahAnggota(${index})"
                >

                    <span class="plus">
                        +
                    </span>

                    Tambah

                </button>

            </div>


            <ul class="member-list">

                ${
                    anggotaWilayah.length === 0

                    ? `

                        <li class="empty">
                            Belum ada anggota
                        </li>

                    `

                    :

                    anggotaWilayah
                    .map((item, nomor) => `

                        <li class="member-item">

                            <div class="member-info">

                                <span class="member-name">

                                    ${nomor + 1}.
                                    ${escapeHTML(item.nama)}

                                </span>

                                <span class="member-age">

                                    ${escapeHTML(item.usia)}
                                    Tahun

                                </span>

                            </div>

                        </li>

                    `)
                    .join("")
                }

            </ul>

        `;

        container.appendChild(card);


        const inputNama =
            document.getElementById(
                `nama-${index}`
            );

        const inputUsia =
            document.getElementById(
                `usia-${index}`
            );


        inputNama.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    tambahAnggota(index);

                }

            }
        );


        inputUsia.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    tambahAnggota(index);

                }

            }
        );

    });

}


/* =====================================
   TAMBAH ANGGOTA KE FIRESTORE
===================================== */

async function tambahAnggota(index) {

    const inputNama =
        document.getElementById(
            `nama-${index}`
        );

    const inputUsia =
        document.getElementById(
            `usia-${index}`
        );


    const nama =
        inputNama.value.trim();

    const usia =
        Number(inputUsia.value);


    /* Nama kosong */

    if (!nama) {

        alert(
            "Masukkan nama anggota."
        );

        inputNama.focus();

        return;

    }


    /* Validasi usia */

    if (
        !Number.isInteger(usia) ||
        usia < 10 ||
        usia > 100
    ) {

        alert(
            "Usia harus antara 10 sampai 100 tahun."
        );

        inputUsia.focus();

        return;

    }


    const namaWilayah =
        wilayah[index];


    /* Cek nama ganda */

    const sudahAda =
        semuaAnggota.some(item => {

            return (
                item.wilayah === namaWilayah &&
                String(item.nama)
                    .trim()
                    .toLowerCase()
                ===
                nama.toLowerCase()
            );

        });


    if (sudahAda) {

        alert(
            "Nama tersebut sudah terdaftar di wilayah ini."
        );

        inputNama.focus();

        return;

    }


    try {

        await db
            .collection("anggota")
            .add({

                nama: nama,

                usia: usia,

                wilayah: namaWilayah,

                dibuatPada:
                    firebase.firestore
                        .FieldValue
                        .serverTimestamp()

            });


        inputNama.value = "";

        inputUsia.value = "";


        alert(
            "Data anggota berhasil disimpan."
        );


    } catch (error) {

        console.error(
            "Gagal menyimpan:",
            error
        );

        alert(
            "Gagal menyimpan data ke Firebase."
        );

    }

}


/* =====================================
   KEAMANAN TEKS
===================================== */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        String(text);

    return div.innerHTML;

}


/* =====================================
   MULAI WEBSITE
===================================== */

ambilDataFirestore();