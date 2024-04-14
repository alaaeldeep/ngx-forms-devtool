import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormRecord,
} from '@angular/forms';
import { Required } from './ngx-form-devtools.service';

@Component({
  selector: 'ngx-form-devtool',
  standalone: true,
  imports: [NgFor, NgIf, NgClass],
  template: `<div *ngIf="isDevToolsOpened" class="container">
      <header class="header">
        <div class="logo-container">
          <span>
            <img height="12" src="favicon.ico" alt="Angular Logo" />
          </span>

          <span> Angular Forms DevTool</span>
        </div>

        <button
          (click)="showDevTools()"
          title="Close dev panel"
          type="button"
          class="closeDevtool"
        >
          ✕
        </button>
      </header>
      <div
        style="
      display: grid;
      grid-template-rows: 56px auto;
      height: calc(-40px + 100vh);
    "
      >
        <!-- filter  -->
        <div
          style="
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 28px 28px;
      "
        >
          <button
            title="Update values and state the form"
            type="button"
            class="headerBtn"
            (click)="updateFormControls()"
          >
            ♺ REFRESH</button
          ><button
            (click)="toggleAll()"
            title="Toggle entire fields"
            type="button"
            class="headerBtn"
          >
            {{ allExpanded ? '[-] COLLAPSE' : '[+] EXPAND' }}</button
          ><input
            name="search"
            placeholder="Filter..."
            type="search"
            class="filterInput"
            (input)="updateFormControls($event)"
          />
        </div>

        <!-- form controls -->
        <div>
          <section class="divider" *ngFor="let formControl of formControls">
            <table
              [ngClass]="{ controlError: formControl.errors }"
              class="rowContainer"
            >
              <thead>
                <tr class="row headRow">
                  <td style="max-width: 140px">
                    <p [title]="formControl.name" class="ctrlName">
                      {{ formControl.name }}
                    </p>
                  </td>

                  <td class="ctrlBtnContainer">
                    <button
                      title="Scroll into view"
                      type="button"
                      class="ctrlBtn"
                      style="width: calc(100% - 30px)"
                      (click)="scrollToControl(formControl.name)"
                    >
                      Native
                    </button>
                    <button
                      title="Toggle field table"
                      type="button"
                      class="ctrlBtn"
                      style="width: 20px"
                      (click)="toggleControl(formControl.name)"
                    >
                      {{ showTableBody[formControl.name] ? '-' : '+' }}
                    </button>
                  </td>
                </tr>
              </thead>
              <tbody *ngIf="showTableBody[formControl.name]">
                <!-- error -->
                <tr class="row" *ngIf="formControl.errors">
                  <td class="attrKey">ERROR:</td>
                  <td
                    *ngFor="let error of getErrors(formControl.errors)"
                    style="
                  display: block;
                  max-width: 100px;
                  font-size: 13px;
                  line-height: 20px;
                "
                  >
                    {{ error }}
                  </td>
                </tr>

                <!-- value -->
                <tr class="row">
                  <td class="attrKey">Value:</td>
                  <td
                    data-testid="branchId-field-value"
                    style="
                  display: block;
                  max-width: 100px;
                  font-size: 13px;
                  line-height: 20px;
                "
                  >
                    <p
                      title=""
                      style="
                    font-size: 13px;
                    line-height: 20px;
                    margin: 0px;
                    padding: 0px;
                  "
                    >
                      {{ formControl.value }}
                    </p>
                  </td>
                </tr>
                <!-- status -->
                <tr class="row">
                  <td class="attrKey">Status:</td>
                  <td>
                    <code>{{ formControl.status }}</code>
                  </td>
                </tr>
                <!-- pristine -->
                <!--   <tr class="row">
              <td class="attrKey">Pristine:</td>
              <td>
                <code
                  [ngClass]="{
                    attrValue: true,
                    truthy: formControl.pristine,
                    falsy: !formControl.pristine
                  }"
                  >{{ formControl.pristine }}</code
                >
              </td>
            </tr> -->
                <!-- touched -->
                <tr class="row">
                  <td class="attrKey">Touched:</td>
                  <td>
                    <code
                      [ngClass]="{
                        attrValue: true,
                        truthy: !formControl.pristine,
                        falsy: formControl.pristine
                      }"
                      >{{ !formControl.pristine }}</code
                    >
                  </td>
                </tr>
                <!-- dirty -->
                <tr class="row">
                  <td class="attrKey">Dirty:</td>
                  <td>
                    <code
                      [ngClass]="{
                        attrValue: true,
                        truthy: formControl.dirty,
                        falsy: !formControl.dirty
                      }"
                      >{{ formControl.dirty }}</code
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>

        <!-- form status -->
        <div *ngIf="form" class="statusContainer">
          <table *ngIf="isFormStatusOpened" class="formStatus">
            <tbody>
              <tr class="row">
                <td>Valid:</td>
                <td
                  [ngClass]="{
                    attrValue: true,
                    truthy: form.valid,
                    falsy: !form.valid
                  }"
                >
                  {{ form.valid }}
                </td>
              </tr>
              <tr class="row">
                <td>Dirty:</td>
                <td
                  [ngClass]="{
                    attrValue: true,
                    truthy: form.dirty,
                    falsy: !form.dirty
                  }"
                >
                  {{ form.dirty }}
                </td>
              </tr>
              <tr class="row">
                <td>Status:</td>
                <td>{{ form.status }}</td>
              </tr>
            </tbody>
          </table>

          <button
            title="Toggle form state panel"
            type="button"
            class="groupStatusBtn"
            (click)="toggleFormStatus()"
          >
            {{ isFormStatusOpened ? '↓' : '↑' }}
            {{ isFormStatusOpened ? 'Close' : 'Open' }}
            Form State
          </button>
        </div>
      </div>
    </div>
    <button
      title="Open dev panel"
      (click)="showDevTools()"
      class="ngxIcon"
      *ngIf="!isDevToolsOpened"
    >
      <img width="18" src="favicon.ico" alt="Angular Logo" />
    </button> `,
  styles: `.ngxIcon {
  appearance: none;
  outline: none;
  border: 0;
  top: 10px;
  right: 10px;
  position: fixed;
  width: 30px;
  height: 30px;
  z-index: 99999;
  border-radius: 50%;
  background: #222831;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.container {
  overflow-y: auto;
  white-space: nowrap;
  text-overflow: ellipsis;
  top: 0px;
  right: 0px;
  position: fixed;
  height: 100vh;
  width: 260px;
  z-index: 99999;
  /*  background: #191d3a; */
  background: #222831;
  display: grid;
  text-align: left;
  color: white;
  font-size: 14px;
  grid-template-rows: 40px auto;
  transition: all 0.3s ease 0s;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.headerBtn {
  appearance: none;
  margin: 0;
  border: 0;
  color: white;
  padding: 5px !important;
  border-radius: 0 !important;
  /* background: #1e2a4a !important; */
  background: #31363f !important;
  transition: 0.2s all;
  font-size: 11px;
  border-right: 1px solid rgb(14, 16, 28);
}
.filterInput {
  display: inline-block;
  border-radius: 0px;
  width: 100%;
  margin: 0px;
  padding: 5px 10px;
  appearance: none;
  font-size: 14px;
  border: 0px;
  color: white;
  grid-column: 1 / 4;
  background: black;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 5px;
}
.closeDevtool {
  margin: 0;
  border: 0;
  color: white;
  font-size: 12px;
  font-weight: bold;
  background: none !important;
  display: flex;
  width: 25px;
  height: 25px;
  justify-content: center;
  align-items: center;
}
.divider {
  border-bottom: 1px dashed #f0006c;
  /*   border-bottom: 1px dashed rgb(191, 22, 80); */
  margin: 0px;
}
.rowContainer {
  padding: 5px 8px;
  width: 100%;
  transition: all 0.3s ease 0s;
  border-left: 2px solid rgb(25, 29, 58);
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ctrlName {
  margin: 0px;
  padding: 0px;
  top: 0px;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  line-height: 24px;
}
.ctrlBtnContainer {
  display: flex;
  align-items: center;
  width: 75px;
  line-height: 22px;
  justify-content: space-between;
}
.ctrlBtn {
  appearance: none;
  margin: 0;
  border: 1px solid rgb(100 104 116);
  color: white;
  padding: 5px !important;
  border-radius: 0 !important;
  background: #31363f !important;
  /*  background: #1e2a4a !important; */
  transition: 0.2s all;
  font-size: 9px;
  line-height: 13px;
}
.basic-ctrlBtn {
  appearance: none;
  margin: 0;
  border: 0;
  color: white;
  padding: 5px !important;
  border-radius: 0 !important;
  background: #1e2a4a !important;
  transition: 0.2s all;
}
.attrKey {
  /*  padding-right: 5px; */
  font-weight: 500;
  vertical-align: top;
  font-size: 13px;
  line-height: 20px;
}
.attrValue {
  font-size: 12px;
  line-height: 20px;
}
.truthy {
  color: rgb(27, 218, 43);
}
.falsy {
  color: #f0006c;
}
button {
  cursor: pointer;
}
.statusContainer {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.groupStatusBtn {
  appearance: none;
  margin: 0;
  border: 0;
  color: white;
  padding: 5px !important;
  border-radius: 0 !important;
  background: #31363f !important;
  transition: 0.2s all;
  width: 100%;
}
.formStatus {
  padding: 5px 10px;
  width: 100%;
  height: 100%;
  background: black;
  border-top: 1px solid rgb(236, 89, 144);
  pointer-events: none;
  opacity: 1;
  transition: all 0.3s linear 0s;
}
.controlError {
  border-left: 4px solid #f0006c;
}
`,
})
export class NgxFormDevtool {
  @Input() @Required form?: FormGroup;
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}
  isDevToolsOpened = false;
  formControls: customFormControl[] = [];
  showTableBody: { [key: string]: boolean } = {};
  allExpanded = false;
  isFormStatusOpened = false;
  ngOnInit() {
    if (this.form) {
      this.updateFormControls();

      this.form.valueChanges.subscribe((x) => {
        if (this.form) {
          this.updateFormControls();
        }
      });
    }
  }
  showDevTools() {
    this.isDevToolsOpened = !this.isDevToolsOpened;
  }
  toggleControl(controlName: string): void {
    this.showTableBody[controlName] = !this.showTableBody[controlName];
  }
  toggleAll(): void {
    if (this.allExpanded) {
      for (const control of this.formControls) {
        this.showTableBody[control.name] = false;
      }
    } else {
      for (const control of this.formControls) {
        this.showTableBody[control.name] = true;
      }
    }
    this.allExpanded = !this.allExpanded;
  }
  toggleFormStatus() {
    this.isFormStatusOpened = !this.isFormStatusOpened;
  }
  getErrors(errors: any): string[] {
    if (!errors) {
      return [];
    }

    return Object.keys(errors);
  }

  updateFormControls($event?: any): void {
    const filterCriteria = $event?.target?.value?.toLowerCase();
    this.formControls = [];

    if (this.form) {
      for (const controlName in this.form.controls) {
        const control = this.form.controls[controlName];

        if (control instanceof FormControl) {
          if (
            !filterCriteria ||
            controlName.toLowerCase().includes(filterCriteria)
          ) {
            const ctr = this.getControlInfo(controlName);
            this.formControls.push(ctr);
          }
        } else if (
          control instanceof FormGroup ||
          control instanceof FormRecord
        ) {
          this.addNestedGroupControls(control, controlName, filterCriteria);
        } else if (control instanceof FormArray) {
          this.addNestedArrayControls(control, controlName, filterCriteria);
        }
      }
    }
  }
  private addNestedGroupControls(
    formGroup: FormGroup,
    parentControlName: string,
    filterCriteria: string
  ): void {
    const nestedControls = formGroup.controls;

    for (const nestedControlName in nestedControls) {
      const nestedControl = nestedControls[nestedControlName];

      if (nestedControl instanceof FormControl) {
        if (
          !filterCriteria ||
          nestedControlName.toLowerCase().includes(filterCriteria) ||
          parentControlName.toLowerCase().includes(filterCriteria)
        ) {
          const fullControlName = `${parentControlName}.${nestedControlName}`;
          const ctr = this.getControlInfo(fullControlName);
          this.formControls.push(ctr);
        }
      } else if (nestedControl instanceof FormGroup) {
        const nestedParentControlName = `${parentControlName}.${nestedControlName}`;
        this.addNestedGroupControls(
          nestedControl,
          nestedParentControlName,
          filterCriteria
        );
      }
    }
  }
  private addNestedArrayControls(
    formArray: FormArray,
    parentControlName: string,
    filterCriteria: string
  ): void {
    const nestedControls = formArray.controls;

    for (const nestedControlName in nestedControls) {
      const control = nestedControls[nestedControlName];

      if (control instanceof FormControl) {
        if (
          !filterCriteria ||
          nestedControlName.toLowerCase().includes(filterCriteria) ||
          parentControlName.toLowerCase().includes(filterCriteria)
        ) {
          const fullControlName = `${parentControlName}.${nestedControlName}`;
          const ctr = this.getControlInfo(fullControlName);
          this.formControls.push(ctr);
        }
      } else if (control instanceof FormGroup) {
        this.addNestedGroupControls(
          control,
          `${parentControlName}.${nestedControlName}`,
          filterCriteria
        );
      }
    }
  }

  scrollToControl(formControlName: string): void {
    const baseControlName = formControlName.split('.')[0];

    const parentElement = this.renderer.parentNode(
      this.elementRef.nativeElement
    );
    const queryTypes = ['formcontrolname', 'formgroupname', 'formarrayname'];

    for (const queryType of queryTypes) {
      const element = parentElement.querySelector(
        `[${queryType}="${baseControlName}"]`
      );
      if (element) {
        if (element.scrollIntoView) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
          });
        }
        return;
      }
    }
  }
  private getControlInfo(controlName: string) {
    const control = this.form!.get(controlName) as AbstractControl;

    return {
      name: controlName,
      pristine: control?.pristine,
      dirty: control?.dirty,
      touched: control?.touched,
      untouched: control?.untouched,
      status: control?.status,
      valid: control?.valid,
      invalid: control?.invalid,
      errors: control?.errors,
      value: control?.value,
    };
  }
}
export interface customFormControl {
  name: string;
  pristine: boolean;
  dirty: boolean;
  touched: boolean;
  status: 'VALID' | 'INVALID' | 'PENDING' | 'DISABLED';
  untouched: boolean;
  valid: boolean;
  invalid: boolean;
  errors: any;
  value?: any;
}
