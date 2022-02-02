import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  isAlphanumericValidator,
  isUrlValidator,
  isValidJsonFormatValidator,
} from '@utils';
import { CreationBaseAbstract } from '../../utils/creation-base.abstract';
import { NamespaceType } from 'iam-client-lib';
import { AppDomain } from '../models/app-domain.interface';
import { AppCreationDefinition } from '../models/app-creation-definition.interface';

@Component({
  selector: 'app-application-creation-form',
  templateUrl: './application-creation-form.component.html',
  styleUrls: ['./application-creation-form.component.scss'],
})
export class ApplicationCreationFormComponent
  extends CreationBaseAbstract
  implements OnInit
{
  @Input() data: AppDomain;
  @Input() isUpdating;
  @Output() proceed = new EventEmitter<AppCreationDefinition>();
  @Output() cancel = new EventEmitter<{ touched: boolean }>();

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.initFormData();
  }

  private initFormData() {
    if (this.isUpdating) {
      const def = this.data.definition;
      let others;

      // Construct Others
      if (def.others) {
        others = JSON.stringify(def.others);
      }

      this.appForm.patchValue({
        orgNamespace: this.data?.orgNamespace,
        name: this.data.name,
        data: {
          appName: def.appName,
          logoUrl: def.logoUrl,
          websiteUrl: def.websiteUrl,
          description: def.description,
          others,
        },
      });
    } else {
      this.appForm.patchValue({
        orgNamespace: this.data?.orgNamespace,
      });
    }
  }

  public appForm = this.fb.group({
    orgNamespace: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(256),
      ]),
    ],
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(256),
        isAlphanumericValidator,
      ],
    ],
    data: this.fb.group({
      appName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(256),
        ]),
      ],
      logoUrl: ['', isUrlValidator()],
      websiteUrl: ['', isUrlValidator()],
      description: '',
      others: ['', isValidJsonFormatValidator],
    }),
  });

  get applicationNamespaceControl() {
    return this.appForm.get('name');
  }

  get namespace(): string {
    return `${this.appForm.value.name}.${NamespaceType.Application}.${this.appForm.value.orgNamespace}`;
  }

  nextHandler() {
    if (this.appForm.invalid) {
      return;
    }
    this.proceed.emit({
      domain: this.namespace,
      data: {
        ...this.appForm.value.data,
        others: this.appForm.value.data?.others
          ? JSON.parse(this.appForm.value.data?.others.trim())
          : undefined,
      },
      ...this.appForm.value,
    });
  }

  cancelHandler() {
    this.cancel.emit({ touched: this.appForm.touched });
  }
}
