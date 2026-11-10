const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(express.json());
app.use(cors());

// Inisialisasi Gemini API (Pastikan API key Anda sudah dimasukkan)
const ai = new GoogleGenAI({ apiKey: 'AQ.Ab8RN6KLFuLPoCxsyCWd8QrCKXWaxeSdtR2M5ulGe02mMeyyOA' });

app.post('/api/buat-soal', async (req, res) => {
  try {
    const { topik, tingkatKesulitan } = req.body;

    // Prompt HOTS lengkap sesuai standar Anda
    const prompt = `Buatkan 5 soal HOTS (Higher Order Thinking Skills) materi Sistem Persamaan Linear Dua Variabel (SPLDV) untuk siswa SMP kelas VIII dengan topik "${topik}" dan tingkat kesulitan "${tingkatKesulitan}".
  
    Ketentuan penyusunan soal:
    1. Soal berbentuk masalah kontekstual yang dekat dengan kehidupan sehari-hari siswa (kegiatan jual beli, kantin sekolah, transportasi, kegiatan sosial, koperasi, dll).
    2. Soal mengukur kemampuan berpikir tingkat tinggi pada level kognitif C4 (menganalisis), C5 (mengevaluasi), dan C6 (mencipta).
    3. Soal mengharuskan siswa menganalisis informasi, menyusun model matematika, memilih strategi penyelesaian, dan menarik kesimpulan.
    4. Sajikan informasi secara realistis, logis, dan tidak ambigu.
    5. PENTING: Distribusikan kunci jawaban ("jawaban_benar") secara acak dan merata di antara pilihan A, B, C, dan D (tidak boleh ada huruf yang mendominasi atau bernilai sama semua).
  
    Untuk setiap soal, sertakan secara lengkap:
    - Indikator HOTS dan level kognitif.
    - Informasi yang diketahui dan ditanyakan.
    - Model matematika SPLDV.
    - Langkah penyelesaian secara sistematis (mengukur 4 indikator Polya: memahami, merencanakan, melaksanakan, dan memeriksa kembali).
    - Kunci jawaban dan kesimpulan berdasarkan konteks permasalahan.

    Berikan respons DALAM FORMAT JSON MURNI berupa array of objects tanpa teks pengantar lain. 
    Struktur JSON harus seperti ini:
    [
      {
        "nomor": 1,
        "indikator_hots": "...",
        "level_kognitif": "C4",
        "soal": "Pertanyaan naratif...",
        "diketahui_ditanyakan": "...",
        "model_matematika": "...",
        "langkah_penyelesaian": "...",
        "pilihan": ["A. ...", "B. ...", "C. ...", "D. ..."],
        "jawaban_benar": "C",
        "kesimpulan": "..."
      }
    ]`;
    // Menggunakan model standar yang didukung penuh oleh @google/genai
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    let textResponse = response.text.trim();
    textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const soalJson = JSON.parse(textResponse);

    res.json({ success: true, data: soalJson });
  } catch (error) {
    console.error("ERROR DETAIL:", error);
    res.status(500).json({ success: false, message: error.message || 'Gagal membuat soal dari AI.' });
  }
});

app.listen(3000, () => {
  console.log('Server backend berjalan di http://localhost:3000');
});