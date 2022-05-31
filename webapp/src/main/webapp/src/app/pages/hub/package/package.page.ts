/*
 * Licensed to Laurent Broudoux (the "Author") under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. Author licenses this
 * file to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from "@angular/router";

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { HubService } from '../../../services/hub.service';
import { APIPackage, APIVersion } from '../../../models/hub.model';

import { markdownConverter } from '../../../components/markdown';

@Component({
  selector: 'hub-package-page',
  templateUrl: './package.page.html',
  styleUrls: ['./package.page.css']
})
export class HubPackagePageComponent implements OnInit {

  package: Observable<APIPackage>;
  packageAPIVersions: Observable<APIVersion[]>;
  resolvedPackage: APIPackage;
  resolvedAPIVersions: APIVersion[];
  
  constructor(private packagesSvc: HubService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.package = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => 
        this.packagesSvc.getPackage(params.get('packageId')))
    );
    this.packageAPIVersions = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => 
        this.packagesSvc.getLatestAPIVersions(params.get('packageId')))
    );

    this.package.subscribe( result => {
      this.resolvedPackage = result;
    });
    this.packageAPIVersions.subscribe (result => {
      this.resolvedAPIVersions = result;
    });
  }

  renderLongDescription() : string {
    return markdownConverter.makeHtml(this.resolvedPackage.longDescription);
  }
}