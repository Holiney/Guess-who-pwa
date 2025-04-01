import React from "react";

export default function ExitModal({ onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md text-center">
        <p className="mb-4 text-lg font-semibold">Точно вийти з гри?</p>
        <div className="flex justify-center gap-4">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onCancel}>
            Скасувати
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded"
            onClick={onConfirm}
          >
            Вийти
          </button>
        </div>
      </div>
    </div>
  );
}
