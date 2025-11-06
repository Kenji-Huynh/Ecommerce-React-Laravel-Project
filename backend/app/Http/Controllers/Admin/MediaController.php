<?php


namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManagerStatic as Image;

class MediaController extends Controller
{
    public function index()
    {
        $items = Media::latest()->paginate(24);
        return view('admin.media.index', compact('items'));
    }

    public function list(Request $request)
    {
        $q = $request->get('q');
        $query = Media::query()->latest();
        if ($q) {
            $query->where('file_name', 'like', "%{$q}%")->orWhere('title', 'like', "%{$q}%");
        }
        $items = $query->paginate(24);
        return response()->json($items);
    }

    public function store(Request $request)
    {
        $request->validate([
            'files' => 'required|array|min:1',
            'files.*' => 'file|mimes:jpg,jpeg,png,webp,gif|max:8192',
        ]);

        $saved = [];
        foreach ($request->file('files') as $file) {
            $path = $file->store('media', 'public');

            // Lấy kích thước ảnh nếu có thể
            $width = null; $height = null;
            try {
                $img = Image::make($file->getRealPath());
                $width = $img->width();
                $height = $img->height();
            } catch (\Throwable $e) {}

            $saved[] = Media::create([
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $path,
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize(),
                'width' => $width,
                'height' => $height,
                'uploaded_by' => optional($request->user())->id,
            ]);
        }

        if ($request->wantsJson()) return response()->json($saved, 201);
        return back()->with('success', 'Tải ảnh lên thành công.');
    }

    public function destroy(Media $medium)
    {
        Storage::disk('public')->delete($medium->file_path);
        $medium->delete();
        return back()->with('success', 'Đã xóa ảnh.');
    }
}