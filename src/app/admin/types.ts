export interface Patient {
    id: string
    queueNumber: number
    name: string
    phone: string
    age: number
    gender: "male" | "female" | "other"
    status: "waiting" | "serving" | "skipped" | "completed"
    dateOfBirth: string
    timeAdded: Date
    timeStarted?: Date
    timeCompleted?: Date
  }
  
  export interface QueueSettings {
    scheduleStart: string
    scheduleEnd: string
    bookingStart: string
    bookingEnd: string
    onlineAppointments: boolean
  }
  
  