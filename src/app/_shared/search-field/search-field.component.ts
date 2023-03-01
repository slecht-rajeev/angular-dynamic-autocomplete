import { FocusMonitor } from "@angular/cdk/a11y";
import { Component, ElementRef, HostBinding, Input, OnDestroy, OnInit, Optional, Self, ViewChild, ViewChildren } from "@angular/core";
import { NgControl, AbstractControlDirective, ControlValueAccessor, FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { MatFormFieldControl } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { Observable, Subject, take } from "rxjs";


export interface FormFieldValue{
    query: string
}

@Component({
    selector: 'app-search-field',
    templateUrl: './search-field.component.html',
    styleUrls: ['./search-field.component.scss'],
    providers: [{
        provide: MatFormFieldControl,
        useClass: SearchFieldComponent
    }],
    host: {
        '[class.userlabel-floating]': 'shouldLabelFloat',
        '[id]': 'id',
    },
  })
export class SearchFieldComponent 
                            implements OnInit, 
                            MatFormFieldControl<string>, OnDestroy,
                            ControlValueAccessor {

    static nextId = 0;
    
    @ViewChild("input" , { static: false }) userid: ElementRef = {} as ElementRef;

    form: FormGroup;


    constructor(
        private focusMonitor: FocusMonitor,
        @Optional() @Self() public ngControl: NgControl,
        private fb: FormBuilder,
        private errorStateMatcher: ErrorStateMatcher,
        private _elementRef: ElementRef
    ) {
        if(ngControl != null) {
            this.ngControl.valueAccessor = this
        }
        this.form = this.fb.group({
            userid: new FormControl('')
        });

    }

    onChange(value: string):void {};
    onTouch():void {};

    writeValue(obj: string): void {
        this.value = obj
    }
    registerOnChange(fn: any): void {
        this.onChange = fn
    }
    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }
    setDisabledState(isDisabled: boolean): void {
        if(isDisabled){
            this.disabled = isDisabled;
            this.form.disable();
        } else {
            this.disabled = false;
            this.form.enable();
        }
        this.stateChanges.next();
    }

    @Input()
    set value(value: string) {
        this.form.get('userid')?.setValue(value)
        this.stateChanges.next()
    }
    get value() {
        return this.form.get('userid')?.value!;
    }
    // private _value: string = '';

    stateChanges = new Subject<void>;
    
    @HostBinding()
    id = `search-field-id-${SearchFieldComponent.nextId++}`;

    @Input()
    set placeholder(value: string) {
        this._placeholder = value
        this.stateChanges.next()
    }
    get placeholder() {
        return this._placeholder!;
    }
    private _placeholder: string = '';



    focused: boolean = false;
    
    get empty():boolean {
        return !!this.value
    }

    @HostBinding('class.focused')
    get shouldLabelFloat(): boolean {
        return this.focused || !this.empty;
    }

    @Input()
    required: boolean = false;

    @Input()
    disabled: boolean = false;

    get errorState() {
        return this.errorStateMatcher.isErrorState(this.ngControl.control, null);
    }
    controlType?: string | undefined;
    autofilled?: boolean | undefined;
    userAriaDescribedBy?: string | undefined;

    
    @HostBinding('attr.aria-describedby') describedBy = '';

    setDescribedByIds(ids: string[]): void {
        this.describedBy = ids.join(" ");
    }


    onContainerClick(): void {
        // console.log(this.abc)
        this.focusMonitor.focusVia(this.userid, 'program')
    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {
        this.focusMonitor.stopMonitoring(this.userid);
        this.stateChanges.complete()
    }

    ngAfterViewInit(){
        
        this.focusMonitor.monitor(this.userid).subscribe((focused) => {
            this.focused = !!focused
            this.stateChanges.next()
        });       
        
        this.focusMonitor
        .monitor(this.userid)
        .pipe(take(1))
        .subscribe(() => {
            this.onTouch();
        })
    }
  
}