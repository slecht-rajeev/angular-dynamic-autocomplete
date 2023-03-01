
import {FocusMonitor} from '@angular/cdk/a11y';
import {BooleanInput, coerceBooleanProperty} from '@angular/cdk/coercion';
import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NgControl,
  Validators,
} from '@angular/forms';
import {MAT_FORM_FIELD, MatFormField, MatFormFieldControl} from '@angular/material/form-field';
import {debounceTime, distinctUntilChanged, filter, finalize, map, Observable, startWith, Subject, switchMap, take, tap} from 'rxjs';
import { CustomeComponentService } from './custom-component.service';
import { UserIdFormField } from './user-id-form-field-directive';
import { UserModel } from './user.model';

/** Custom `MatFormFieldControl` for telephone number input. */
@Component({
  selector: 'app-custom-form-field-control',
  templateUrl: 'custom-form-field-control.component.html',
  styleUrls: ['custom-form-field-control.component.scss'],
  providers: [{provide: MatFormFieldControl, useExisting: CustomFormFieldControlComponent}],
  host: {
    '[class.userlabel-floating]': 'shouldLabelFloat',
    '[id]': 'id',
  },
})
export class CustomFormFieldControlComponent implements OnInit, ControlValueAccessor, MatFormFieldControl<UserIdFormField>, OnDestroy {

  options: UserModel[] = [];
  filteredOptions: UserModel[] = [];
  
  static nextId = 0;
  @ViewChild('userId') userIdInput: HTMLInputElement = {} as HTMLInputElement;

  parts = this._formBuilder.group({
    userId: ['']
  });
  stateChanges = new Subject<void>();
  focused = false;
  touched = false;
  controlType = 'example-tel-input';
  id = `example-tel-input-${CustomFormFieldControlComponent.nextId++}`;
  // onChange = (_: any) => {};
  onTouched = () => {};

  get empty() {
    const {
      value: {userId},
    } = this.parts;

    return !userId;
  }

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input('aria-describedby') userAriaDescribedBy: string = "";

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  private _placeholder: string = "";

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: BooleanInput) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.parts.disable() : this.parts.enable();
    this.stateChanges.next();
  }
  private _disabled = false;

  @Input()
  get value(): UserIdFormField {
    if (this.parts.valid) {
      const {
        value: {userId},
      } = this.parts;
      return new UserIdFormField(userId!);
    }
    return  new UserIdFormField('');
  }
  set value(tel: UserIdFormField | null) {
    const userId  = tel || new UserIdFormField('');
    this.parts.setValue(userId);
    this.stateChanges.next();
  }

  get errorState(): boolean {
    return this.parts.invalid && this.touched;
  }

  constructor(
    private customerService: CustomeComponentService,
    private _formBuilder: FormBuilder,
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef<HTMLElement>,
    @Optional() @Inject(MAT_FORM_FIELD) public _formField: MatFormField,
    @Optional() @Self() public ngControl: NgControl,
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    
    // this.filteredOptions = this.parts.controls.userId.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter(value || '')),
    // );
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  onFocusIn(event: FocusEvent) {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  onFocusOut(event: FocusEvent) {
    if (!this._elementRef.nativeElement.contains(event.relatedTarget as Element)) {
      this.touched = true;
      this.focused = false;
      this.onTouched();
      this.stateChanges.next();
    }
  }

  autoFocusPrev(control: AbstractControl, prevElement: HTMLInputElement): void {
    if (control.value.length < 1) {
      this._focusMonitor.focusVia(prevElement, 'program');
    }
  }

  setDescribedByIds(ids: string[]) {
    // const controlElement = this._elementRef.nativeElement.querySelector(
    //   '.example-tel-input-container',
    // )!;
    // controlElement.setAttribute('aria-describedby', ids.join(' '));
  }

  onContainerClick() {
    this._focusMonitor.focusVia(this.userIdInput, 'program');
  }

  writeValue(tel: UserIdFormField | null): void {
    this.value = tel;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // _handleInput(control: AbstractControl): void {
  //   this.onChange(this.value);
  // }

  ngOnInit(): void {
    
    this._focusMonitor
      .monitor(this.userIdInput)
      .pipe(take(1))
      .subscribe(() => {
        this.onToutch();
      });



      this.parts.controls.userId.valueChanges
      .pipe(
        filter(res => {
          return res !== null
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {
          this.filteredOptions = [];
        }),
        switchMap(value => this.customerService.getList(this.parts.controls.userId.value)
          .pipe(
            finalize(() => {
              
            }),
          )
        )
      )
      .subscribe((data: any) => {
        if (data.results === undefined) {
          // this.errorMsg = data['Error'];
          this.filteredOptions = [];
        } else {
          // this.errorMsg = "";
          this.filteredOptions = data.results;
        }
        // console.log(this.filteredMovies);
      });
  }

  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.options.filter(option => option.toLowerCase().includes(filterValue));
  // }

  
  onChange(value: UserIdFormField):void {};
  onToutch():void {};

}