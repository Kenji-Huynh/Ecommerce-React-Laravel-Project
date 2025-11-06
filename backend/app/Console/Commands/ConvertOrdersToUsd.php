<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Console\Command;

class ConvertOrdersToUsd extends Command
{
    protected $signature = 'orders:convert-to-usd {divisor : Divide current monetary fields by this number (e.g., 25000)}'
        . ' {--dry-run : Only show what would change}';

    protected $description = 'One-time conversion: divide order monetary amounts (subtotal,tax,shipping,discount,total and item.price) to switch from VND to USD';

    public function handle(): int
    {
        $divisor = (float) $this->argument('divisor');
        $dry = (bool) $this->option('dry-run');

        if ($divisor <= 0) {
            $this->error('Divisor must be > 0');
            return self::INVALID;
        }

        $ordersCount = 0;
        Order::chunk(200, function ($chunk) use (&$ordersCount, $divisor, $dry) {
            foreach ($chunk as $o) {
                $oldSubtotal = (float) $o->subtotal;
                $oldTax = (float) $o->tax;
                $oldShipping = (float) $o->shipping;
                $oldDiscount = (float) ($o->discount ?? 0);
                $oldTotal = (float) $o->total;

                $newSubtotal = round($oldSubtotal / $divisor, 2);
                $newTax = round($oldTax / $divisor, 2);
                $newShipping = round($oldShipping / $divisor, 2);
                $newDiscount = $oldDiscount ? round($oldDiscount / $divisor, 2) : 0.0;
                $newTotal = round($oldTotal / $divisor, 2);

                if ($dry) {
                    $this->line("Order #{$o->id}: total {$oldTotal} -> {$newTotal} USD");
                } else {
                    $o->subtotal = $newSubtotal;
                    $o->tax = $newTax;
                    $o->shipping = $newShipping;
                    $o->discount = $newDiscount;
                    $o->total = $newTotal;
                    $o->save();
                }
                $ordersCount++;
            }
        });

        $itemsCount = 0;
        OrderItem::chunk(500, function ($chunk) use (&$itemsCount, $divisor, $dry) {
            foreach ($chunk as $it) {
                $old = (float) $it->price;
                $new = round($old / $divisor, 2);
                if ($dry) {
                    $this->line("Item #{$it->id} (order {$it->order_id}): price {$old} -> {$new} USD");
                } else {
                    $it->price = $new;
                    $it->save();
                }
                $itemsCount++;
            }
        });

        if ($dry) {
            $this->info("Dry-run complete. {$ordersCount} orders and {$itemsCount} items scanned.");
        } else {
            $this->info("Converted {$ordersCount} orders and {$itemsCount} items using divisor {$divisor}.");
        }

        return self::SUCCESS;
    }
}
