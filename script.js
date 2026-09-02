/*
|--------------------------------------------------------------------------
| KONFIGURASI
|--------------------------------------------------------------------------
*/

// GANTI dengan URL Web App Google Apps Script Anda

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbymP4QRvOGTDP97-lYclphhgWHhUWpMaWtCGJYUZ-Rnck7TXuhk7WJG8cMkcNbojgPf/dev";


// Nomor WhatsApp tujuan
// Gunakan kode negara tanpa tanda +
//
// Contoh Indonesia:
// 6285736135920

const NOMOR_WHATSAPP =
    "6285773372026";


/*
|--------------------------------------------------------------------------
| ELEMENT
|--------------------------------------------------------------------------
*/

const form =
    document.getElementById("formKonfirmasi");

const submitButton =
    document.getElementById("submitButton");

const successMessage =
    document.getElementById("successMessage");


/*
|--------------------------------------------------------------------------
| FORM SUBMIT
|--------------------------------------------------------------------------
*/


form.addEventListener("submit", function (event) {

    event.preventDefault();

    const nama = document
        .getElementById("nama")
        .value
        .trim();

    const ucapan = document
        .getElementById("ucapan")
        .value
        .trim();

    const statusElement = document.querySelector(
        'input[name="status"]:checked'
    );

    if (!statusElement) {
        alert("Silakan pilih konfirmasi kehadiran.");
        return;
    }

    const status = statusElement.value;

    // =========================
    // TOMBOL LOADING
    // =========================

    submitButton.disabled = true;
    submitButton.innerText = "Mengirim...";


    // =========================
    // DATA GOOGLE SHEETS
    // =========================

    const data = {
        nama: nama,
        ucapan: ucapan,
        status: status
    };


    // =========================
    // PESAN WHATSAPP
    // =========================

    const simbol = status === "HADIR"
        ? "✅"
        : "❌";

    const pesan =
`*Dear Valued Partners,

Thank you for your interest in attending the Grand Opening of Notaris Kevin. We are delighted to invite you to celebrate this special occasion with us.

To confirm your attendance, kindly fill in the details below:

Ucapan : ${ucapan}
Nama : ${nama}
Konfirmasi Kehadiran : ${simbol} ${status}
Number of Guests: (Maximum 2 guests)

We look forward to welcoming you and celebrating this exciting milestone together. ✨

Best regards, 
Notaris Kevin`;


    // =========================
    // URL WHATSAPP
    // =========================

    const whatsappURL =
        "https://wa.me/" +
        NOMOR_WHATSAPP +
        "?text=" +
        encodeURIComponent(pesan);


    // =========================
    // BUKA WHATSAPP
    // LANGSUNG DARI KLIK USER
    // =========================

    window.location.href = whatsappURL;


    // =========================
    // SIMPAN KE GOOGLE SHEETS
    // =========================

    fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(data)
    })
    .catch(function (error) {
        console.error(
            "Gagal menyimpan ke Google Sheets:",
            error
        );
    });


    // =========================
    // RESET FORM
    // =========================

    successMessage.style.display = "block";

    form.reset();

});


// form.addEventListener("submit", async function (event) {

//     event.preventDefault();


//     const nama =
//         document
//             .getElementById("nama")
//             .value
//             .trim();


//     const ucapan =
//         document
//             .getElementById("ucapan")
//             .value
//             .trim();


//     const statusElement =
//         document.querySelector(
//             'input[name="status"]:checked'
//         );


//     if (!statusElement) {

//         alert(
//             "Silakan pilih konfirmasi kehadiran."
//         );

//         return;
//     }


//     const status =
//         statusElement.value;


//     /*
//     |--------------------------------------------------------------------------
//     | TOMBOL LOADING
//     |--------------------------------------------------------------------------
//     */

//     submitButton.disabled = true;

//     submitButton.innerText =
//         "Mengirim...";


//     /*
//     |--------------------------------------------------------------------------
//     | DATA
//     |--------------------------------------------------------------------------
//     */

//     const data = {

//         nama: nama,

//         ucapan: ucapan,

//         status: status

//     };


//     /*
//     |--------------------------------------------------------------------------
//     | KIRIM KE GOOGLE SHEETS
//     |--------------------------------------------------------------------------
//     */

//     try {

//         await fetch(
//             GOOGLE_SCRIPT_URL,
//             {

//                 method: "POST",

//                 mode: "no-cors",

//                 headers: {
//                     "Content-Type":
//                         "text/plain;charset=utf-8"
//                 },

//                 body:
//                     JSON.stringify(data)

//             }
//         );


//         /*
//         |--------------------------------------------------------------------------
//         | PESAN WHATSAPP
//         |--------------------------------------------------------------------------
//         */

//         const simbol =
//             status === "HADIR"
//                 ? "✅"
//                 : "❌";


//         const pesan =

// `*UCAPAN SELAMAT & KONFIRMASI KEHADIRAN*

// ${ucapan}

// *Nama:*
// ${nama}

// *Konfirmasi Kehadiran:*
// ${simbol} ${status}`;


//         /*
//         |--------------------------------------------------------------------------
//         | BUKA WHATSAPP
//         |--------------------------------------------------------------------------
//         */

//         const whatsappURL =
//             "https://wa.me/" +
//             NOMOR_WHATSAPP +
//             "?text=" +
//             encodeURIComponent(pesan);


//         /*
//         |--------------------------------------------------------------------------
//         | TAMPILKAN SUKSES
//         |--------------------------------------------------------------------------
//         */

//         successMessage.style.display =
//             "block";


//         form.reset();


//         /*
//         |--------------------------------------------------------------------------
//         | BUKA WHATSAPP
//         |--------------------------------------------------------------------------
//         */

//         setTimeout(function () {

//             window.open(
//                 whatsappURL,
//                 "_blank"
//             );

//         }, 500);


//         /*
//         |--------------------------------------------------------------------------
//         | UPDATE STATISTIK
//         |--------------------------------------------------------------------------
//         */

//         setTimeout(
//             loadStatistics,
//             1500
//         );


//     } catch (error) {

//         console.error(error);

//         alert(
//             "Terjadi kesalahan. Silakan coba lagi."
//         );

//     }


//     submitButton.disabled = false;

//     submitButton.innerText =
//         "Kirim Konfirmasi";

// });


/*
|--------------------------------------------------------------------------
| AMBIL STATISTIK
|--------------------------------------------------------------------------
*/

async function loadStatistics() {

    try {

        const response =
            await fetch(
                GOOGLE_SCRIPT_URL
            );


        const data =
            await response.json();


        if (!data.success) {

            return;
        }


        document
            .getElementById("jumlahHadir")
            .innerText =
            data.hadir;


        document
            .getElementById("jumlahTidakHadir")
            .innerText =
            data.tidakHadir;


        document
            .getElementById("jumlahTotal")
            .innerText =
            data.total;


    } catch (error) {

        console.error(
            "Gagal mengambil statistik:",
            error
        );

    }

}


/*
|--------------------------------------------------------------------------
| LOAD SAAT WEBSITE DIBUKA
|--------------------------------------------------------------------------
*/

loadStatistics();


// TAMU UNDANGAN
document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const namaTamu = params.get("to");

    const guestName = document.getElementById("guestName");

    if (namaTamu) {
        guestName.textContent = namaTamu;
    } else {
        guestName.textContent = "Tamu Undangan";
    }
});
