export const initOneSignal = () => {
  if (typeof window !== "undefined") {
    console.log("✅ OneSignal SDK dimulai...");

    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async (OneSignal) => {
      console.log("🔄 Menginisialisasi OneSignal...");

      await OneSignal.init({
        appId: "cdd6fcca-e560-4ddc-9003-7032784314f2", // Ganti dengan App ID kamu
        notifyButton: {
          enable: true, // Menampilkan tombol subscribe
        },
      });

      console.log("✅ OneSignal berhasil diinisialisasi");

      // Cek status notifikasi dengan API terbaru
      const permission = await OneSignal.Notifications.permissionNative;
      console.log("🔔 Status Notifikasi:", permission);

      if (permission !== "granted") {
        console.log("📢 Menampilkan prompt pendaftaran...");
        await OneSignal.Notifications.requestPermission();
      }

      // Cek apakah user sudah subscribe
      const isSubscribed = await OneSignal.User.PushSubscription.optedIn;
      console.log("📡 Status Subscribe:", isSubscribed);

      // Jika belum subscribe, maka subscribe otomatis
      if (!isSubscribed) {
        console.log("🔄 Mendaftarkan user ke OneSignal...");
        await OneSignal.User.PushSubscription.optIn();
        console.log("✅ User berhasil subscribe!");
      }
    });
  }
};
