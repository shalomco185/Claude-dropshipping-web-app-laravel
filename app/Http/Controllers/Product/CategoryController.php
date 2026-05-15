<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $store = $request->user()->stores()->where('is_active', true)->first();

        return Inertia::render('Products/Categories', [
            'categories' => $store ? $store->categories()->orderBy('sort_order')->get() : [],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $store = $request->user()->stores()->where('is_active', true)->first();
        abort_unless($store, 403);

        $data = $request->validate([
            'name' => 'required|string|max:120',
            'parent_id' => 'nullable|exists:categories,id',
            'sort_order' => 'nullable|integer',
        ]);

        $data['store_id'] = $store->id;
        $data['slug'] = Str::slug($data['name']);

        Category::create($data);

        return back()->with('success', 'Category created.');
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        abort_unless($category->store->user_id === auth()->id(), 403);

        $data = $request->validate([
            'name' => 'required|string|max:120',
            'parent_id' => 'nullable|exists:categories,id',
            'sort_order' => 'nullable|integer',
        ]);

        $data['slug'] = Str::slug($data['name']);
        $category->update($data);

        return back()->with('success', 'Category updated.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        abort_unless($category->store->user_id === auth()->id(), 403);

        $category->delete();

        return back()->with('success', 'Category deleted.');
    }

    public function create(): Response
    {
        return Inertia::render('Products/Categories');
    }

    public function show(Category $category): Response
    {
        abort_unless($category->store->user_id === auth()->id(), 403);

        return Inertia::render('Products/Categories', [
            'category' => $category,
        ]);
    }

    public function edit(Category $category): Response
    {
        return $this->show($category);
    }
}
