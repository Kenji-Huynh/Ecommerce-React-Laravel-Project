<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;

class ConvertPricesToUsd extends Command
{
    protected $signature = 'products:convert-to-usd {divisor : Divide current prices by this number (e.g., 25000)}'
        . ' {--dry-run : Only show what would change}';

    protected $description = 'One-time conversion: divide all product price/compare_price by a divisor to switch from VND to USD';

    public function handle(): int
    {
        $divisor = (float) $this->argument('divisor');
        $dry = (bool) $this->option('dry-run');

        if ($divisor <= 0) {
            $this->error('Divisor must be > 0');
            return self::INVALID;
        }

        $count = 0;
        Product::chunk(200, function ($chunk) use (&$count, $divisor, $dry) {
            foreach ($chunk as $p) {
                $oldPrice = (float) $p->price;
                $oldCompare = (float) ($p->compare_price ?? 0);
                $newPrice = round($oldPrice / $divisor, 2);
                $newCompare = $oldCompare ? round($oldCompare / $divisor, 2) : null;

                if ($dry) {
                    $this->line("#{$p->id} {$p->name}: {$oldPrice} -> {$newPrice} USD" . ($oldCompare ? ", compare: {$oldCompare} -> {$newCompare}" : ''));
                } else {
                    $p->price = $newPrice;
                    $p->compare_price = $newCompare;
                    $p->save();
                }
                $count++;
            }
        });

        if ($dry) {
            $this->info("Dry-run complete. {$count} products scanned.");
        } else {
            $this->info("Converted prices for {$count} products using divisor {$divisor}.");
        }

        return self::SUCCESS;
    }
}
