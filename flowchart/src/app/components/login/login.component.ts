import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private router: Router) {}

  // Définir l'email et le mot de passe uniques
  email: string = '';
  password: string = '';

  // Email et mot de passe valides
  validEmail: string = 'admin@gmail.com';
  validPassword: string = 'admin123';

  onSubmit() {
    // Vérifier si l'email et le mot de passe sont corrects
    if (this.email === this.validEmail && this.password === this.validPassword) {
      console.log('Connexion réussie');
      this.router.navigate(['/home']);
    } else {
      alert('Please fill in both fields');
    }
  }
}
