# NgxFormDevtool

This Library will help you to debug forms when working Reactive Forms, and give you more insight about your form's detail.

## Install

```
  npm install ngx-form-devtool -D

```

## Live Demo

[stackblitz](https://stackblitz.com/edit/stackblitz-starters-d488i2?file=src%2Fmain.ts)

## Quickstart

```
 import { Component } from '@angular/core';
 import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
 import { NgxFormDevtool } from 'ngx-form-devtool';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule ,
    NgxFormDevtool
  ],
  template: `
    <form
      [formGroup]="form"
      class="form"
    >
  <div class="form-field">
    <label for="name">First Name</label>
    <input
      formControlName="firstName"
      type="text"
      placeholder="Enter your name"
    />
  </div>

  <!-- here 👇 -->
  <ngx-form-devtool [form]="form" />
</form>
  `,
})
export class YourComponent  {

  form = this.formBuilder.group({
    firstName: ['alaa', [Validators.required, Validators.minLength(4)]],
  });

  constructor(private formBuilder: FormBuilder) {}
}

```

## Compatibility

```
  Angular 16 , Angular 17

```
