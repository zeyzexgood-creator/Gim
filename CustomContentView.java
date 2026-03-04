package com.example.webapp;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.Typeface;
import android.graphics.drawable.Drawable;
import android.os.Handler;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.view.View;

import androidx.core.content.ContextCompat;

import java.util.Random;

public class CustomContentView extends View {

    private Paint textPaint;
    private Paint titlePaint;
    private Paint rectPaint;
    private Paint linePaint;
    
    private float offset = 0;
    private boolean isAnimating = true;
    private Handler animationHandler = new Handler();
    private Runnable animationRunnable;
    
    private String title = "Selamat Datang!";
    private String[] content = {
        "Ini adalah konten custom view",
        "Anda dapat menyesuaikan tampilan ini",
        "Sesuai dengan kebutuhan aplikasi Anda"
    };
    
    private int[] colors = {
        Color.parseColor("#FF5722"),
        Color.parseColor("#2196F3"),
        Color.parseColor("#4CAF50"),
        Color.parseColor("#9C27B0")
    };
    
    private int currentColorIndex = 0;
    private Random random = new Random();

    public CustomContentView(Context context) {
        super(context);
        init();
    }

    public CustomContentView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public CustomContentView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    private void init() {
        // Inisialisasi Paint untuk teks judul
        titlePaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        titlePaint.setColor(Color.BLACK);
        titlePaint.setTextSize(120f);
        titlePaint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        titlePaint.setTextAlign(Paint.Align.CENTER);

        // Inisialisasi Paint untuk teks konten
        textPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        textPaint.setColor(Color.DKGRAY);
        textPaint.setTextSize(60f);
        textPaint.setTextAlign(Paint.Align.CENTER);

        // Inisialisasi Paint untuk rectangle
        rectPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        rectPaint.setStyle(Paint.Style.STROKE);
        rectPaint.setStrokeWidth(8f);

        // Inisialisasi Paint untuk garis dekorasi
        linePaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        linePaint.setStyle(Paint.Style.STROKE);
        linePaint.setStrokeWidth(4f);
        linePaint.setColor(Color.LTGRAY);

        // Mulai animasi
        startAnimation();
    }

    private void startAnimation() {
        animationRunnable = new Runnable() {
            @Override
            public void run() {
                if (isAnimating) {
                    offset += 5;
                    if (offset > getWidth()) {
                        offset = 0;
                        // Ganti warna judul secara acak
                        currentColorIndex = random.nextInt(colors.length);
                        titlePaint.setColor(colors[currentColorIndex]);
                    }
                    invalidate(); // Redraw
                    animationHandler.postDelayed(this, 50);
                }
            }
        };
        animationHandler.post(animationRunnable);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);

        int width = getWidth();
        int height = getHeight();

        // Gambar latar belakang
        canvas.drawColor(Color.WHITE);

        // Gambar garis dekorasi di bagian atas
        linePaint.setColor(Color.parseColor("#FF5722"));
        canvas.drawLine(width * 0.2f, 100, width * 0.8f, 100, linePaint);

        // Gambar rectangle beranimasi
        rectPaint.setColor(colors[currentColorIndex]);
        float rectSize = 200 + (float)Math.sin(System.currentTimeMillis() * 0.005) * 50;
        canvas.drawRect(
            width / 2f - rectSize / 2,
            200 + (float)Math.sin(offset * 0.05) * 30,
            width / 2f + rectSize / 2,
            400 + (float)Math.cos(offset * 0.05) * 30,
            rectPaint
        );

        // Gambar judul
        canvas.drawText(title, width / 2f, 600, titlePaint);

        // Gambar konten
        int startY = 800;
        for (int i = 0; i < content.length; i++) {
            canvas.drawText(content[i], width / 2f, startY + (i * 100), textPaint);
        }

        // Gambar informasi tambahan
        textPaint.setTextSize(40f);
        textPaint.setColor(Color.GRAY);
        canvas.drawText("Swipe down untuk refresh", width / 2f, height - 200, textPaint);
        canvas.drawText("Koneksi: " + (isConnected() ? "Tersambung" : "Terputus"), 
                       width / 2f, height - 150, textPaint);
        
        // Reset textPaint untuk ukuran normal
        textPaint.setTextSize(60f);
        textPaint.setColor(Color.DKGRAY);
    }

    private boolean isConnected() {
        // Method ini akan di-set dari MainActivity
        return true; // Default value
    }

    public void setConnectionStatus(boolean isConnected) {
        // Method untuk update status koneksi dari MainActivity
        invalidate();
    }

    public void updateContent(String title, String[] content) {
        this.title = title;
        this.content = content;
        invalidate();
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        isAnimating = true;
        startAnimation();
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        isAnimating = false;
        animationHandler.removeCallbacks(animationRunnable);
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        switch (event.getAction()) {
            case MotionEvent.ACTION_DOWN:
                // Ubah warna saat disentuh
                currentColorIndex = (currentColorIndex + 1) % colors.length;
                titlePaint.setColor(colors[currentColorIndex]);
                invalidate();
                return true;
        }
        return super.onTouchEvent(event);
    }
}
