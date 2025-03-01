"use client"
import React, { useState } from 'react'
import { QueueSettings } from './types';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Settings2 } from 'lucide-react';

function clinicSetting() {
    const [settings, setSettings] = useState<QueueSettings>({
        scheduleStart: "17:00",
        scheduleEnd: "22:00",
        bookingStart: "17:00",
        bookingEnd: "22:00",
        onlineAppointments: true,
      });
  return (
    <div>
        <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings2 className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Settings</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-6 mt-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        Schedule Window
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Information Information Information Information
                      </p>
                      <div className="flex gap-4">
                        <Input
                          type="time"
                          value={settings.scheduleStart}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              scheduleStart: e.target.value,
                            }))
                          }
                        />
                        <span className="flex items-center">-</span>
                        <Input
                          type="time"
                          value={settings.scheduleEnd}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              scheduleEnd: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        Booking Window
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Information Information Information Information
                      </p>
                      <div className="flex gap-4">
                        <Input
                          type="time"
                          value={settings.bookingStart}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              bookingStart: e.target.value,
                            }))
                          }
                        />
                        <span className="flex items-center">-</span>
                        <Input
                          type="time"
                          value={settings.bookingEnd}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              bookingEnd: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        Online Appointment Status
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Information Information Information Information
                          </p>
                        </div>
                        <Switch
                          checked={settings.onlineAppointments}
                          onCheckedChange={(checked) =>
                            setSettings((prev) => ({
                              ...prev,
                              onlineAppointments: checked,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
    </div>
  )
}

export default clinicSetting