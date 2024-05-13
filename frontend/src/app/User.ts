export interface User {
  id: number;
  name: string;
  email: string;
  gender: string;
  department: string;
  location: string;
  dateOfJoining: string; // Assuming date is stored as string for simplicity
}

  export interface Location {
    id: number;
    name: string;
  }
  
  export interface Department {
    id: number;
    name: string;
  }
  
 
  