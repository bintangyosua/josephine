# Gunakan image node versi LTS
FROM node:22-alpine

# Buat direktori kerja di container
WORKDIR /app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua file project
COPY . .

# Build TypeScript
RUN npm run build

# Expose port jika aplikasimu pakai port tertentu (optional, bisa disesuaikan)
# EXPOSE 3000

# Command untuk menjalankan aplikasi
CMD ["npm", "start"]
