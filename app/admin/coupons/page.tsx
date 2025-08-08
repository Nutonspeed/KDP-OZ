"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { fetchCoupons, createCoupon, updateCoupon, deleteCoupon } from "@/actions/coupons";
import type { Coupon } from "@/types/coupon";

export default function AdminCoupons() {
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState<Coupon | null>(null);
  const [formState, setFormState] = useState({
    code: "",
    description: "",
    discount_percentage: 0,
    discount_amount: 0,
    valid_from: "",
    valid_to: "",
    min_order_value: 0,
    max_uses: 0,
  });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, router, loading]);

  useEffect(() => {
    const loadCoupons = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const { coupons: fetchedCoupons, error } = await fetchCoupons();
      if (!error) {
        setCoupons(fetchedCoupons);
      } else {
        console.error("Failed to fetch coupons:", error);
      }
      setLoading(false);
    };
    loadCoupons();
  }, [isAuthenticated]);

  const handleAddCouponClick = () => {
    setCurrentCoupon(null);
    setFormState({
      code: "",
      description: "",
      discount_percentage: 0,
      discount_amount: 0,
      valid_from: "",
      valid_to: "",
      min_order_value: 0,
      max_uses: 0,
    });
    setIsDialogOpen(true);
  };

  const handleEditCouponClick = (coupon: Coupon) => {
    setCurrentCoupon(coupon);
    setFormState({
      code: coupon.code,
      description: coupon.description || "",
      discount_percentage: coupon.discount_percentage ?? 0,
      discount_amount: coupon.discount_amount ?? 0,
      valid_from: coupon.valid_from ?? "",
      valid_to: coupon.valid_to ?? "",
      min_order_value: coupon.min_order_value ?? 0,
      max_uses: coupon.max_uses ?? 0,
    });
    setIsDialogOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;
    setFormState((prev) => ({
      ...prev,
      [id]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Build coupon data. Only include discount_percentage or discount_amount if > 0.
    const data: any = {
      code: formState.code.trim(),
      description: formState.description.trim() || undefined,
      valid_from: formState.valid_from || undefined,
      valid_to: formState.valid_to || undefined,
      min_order_value: formState.min_order_value > 0 ? formState.min_order_value : undefined,
      max_uses: formState.max_uses > 0 ? formState.max_uses : undefined,
    };
    if (formState.discount_percentage > 0) {
      data.discount_percentage = formState.discount_percentage / 100; // convert from percent to decimal
    } else if (formState.discount_amount > 0) {
      data.discount_amount = formState.discount_amount;
    }
    let result;
    if (currentCoupon) {
      result = await updateCoupon(currentCoupon.id, data);
    } else {
      result = await createCoupon(data);
    }
    if ((result as any).success) {
      const { coupons: refreshed, error } = await fetchCoupons();
      if (!error) setCoupons(refreshed);
      setIsDialogOpen(false);
    } else {
      alert((result as any).error || "Failed to save coupon");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this coupon? This action cannot be undone.")) {
      const res = await deleteCoupon(id);
      if (res.success) {
        const { coupons: refreshed, error } = await fetchCoupons();
        if (!error) setCoupons(refreshed);
      } else {
        alert(res.error || "Failed to delete coupon");
      }
    }
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Coupons</h1>
      <Button onClick={handleAddCouponClick} className="mb-4 flex items-center gap-2">
        <PlusCircle size={16} /> Add Coupon
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Coupons</CardTitle>
          <CardDescription>List of all discount codes</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Discount</TableHead>
                <TableHead className="text-right">Valid From</TableHead>
                <TableHead className="text-right">Valid To</TableHead>
                <TableHead className="text-right">Min Order</TableHead>
                <TableHead className="text-right">Max Uses</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => {
                const discountLabel =
                  coupon.discount_percentage !== undefined
                    ? `${(coupon.discount_percentage * 100).toFixed(0)}%`
                    : coupon.discount_amount !== undefined
                    ? `$${coupon.discount_amount.toFixed(2)}`
                    : "";
                return (
                  <TableRow key={coupon.id}>
                    <TableCell>{coupon.code}</TableCell>
                    <TableCell>{coupon.description}</TableCell>
                    <TableCell className="text-right">{discountLabel}</TableCell>
                    <TableCell className="text-right">
                      {coupon.valid_from ? new Date(coupon.valid_from).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {coupon.valid_to ? new Date(coupon.valid_to).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {coupon.min_order_value !== undefined ? `$${coupon.min_order_value.toFixed(2)}` : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {coupon.max_uses !== undefined ? coupon.max_uses : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="icon" variant="outline" onClick={() => handleEditCouponClick(coupon)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="destructive" onClick={() => handleDelete(coupon.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentCoupon ? "Edit Coupon" : "Add Coupon"}</DialogTitle>
            <DialogDescription>Fill in the details for the coupon.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="code">Code</Label>
              <Input id="code" value={formState.code} onChange={handleFormChange} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" value={formState.description} onChange={handleFormChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="discount_percentage">Discount (%)</Label>
                <Input
                  id="discount_percentage"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formState.discount_percentage}
                  onChange={handleFormChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="discount_amount">Discount Amount</Label>
                <Input
                  id="discount_amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formState.discount_amount}
                  onChange={handleFormChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="valid_from">Valid From</Label>
                <Input id="valid_from" type="date" value={formState.valid_from} onChange={handleFormChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="valid_to">Valid To</Label>
                <Input id="valid_to" type="date" value={formState.valid_to} onChange={handleFormChange} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="min_order_value">Min Order Value</Label>
                <Input
                  id="min_order_value"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formState.min_order_value}
                  onChange={handleFormChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="max_uses">Max Uses</Label>
                <Input
                  id="max_uses"
                  type="number"
                  min="0"
                  step="1"
                  value={formState.max_uses}
                  onChange={handleFormChange}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{currentCoupon ? "Update" : "Create"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}