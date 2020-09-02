import {Location} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {DiscordUser} from '../../../schemas/Discord';
import {PublicationState, WorkshopCollection, WorkshopCollectionFull} from '../../../schemas/Workshop';
import {DiscordService} from '../../../shared/discord.service';
import {debrace} from '../../../shared/DisplayUtils';
import {getUser} from '../../APIHelper';
import {WorkshopService} from '../workshop.service';
import {EditSettingsDialogComponent} from './edit-settings-dialog/edit-settings-dialog.component';
import {PublishDialogComponent} from './publish-dialog/publish-dialog.component';

@Component({
  selector: 'avr-collection-edit',
  templateUrl: './collection-edit.component.html',
  styleUrls: ['../common.scss', './collection-edit.component.scss', '../collection/collection.component.scss']
})
export class CollectionEditComponent implements OnInit {
  // exports
  PublicationState = PublicationState;
  debrace = debrace;

  // data
  collection: WorkshopCollectionFull;
  owner: DiscordUser;
  editors: DiscordUser[];

  // state
  loading = true;
  error: string;

  constructor(private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar,
              private dialog: MatDialog, private location: Location,
              private workshopService: WorkshopService, private discordService: DiscordService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => this.loadCollection(params.get('id'))
    );
  }

  // event listeners
  onCollectionInit(collection: WorkshopCollectionFull) {
    this.collection = collection;
    this.editors = [];
    this.loadOwner();
    this.loadEditors();
  }

  onAddEditor(editor: DiscordUser) {
    this.workshopService.addCollectionEditor(this.collection._id, editor.id)
      .subscribe(response => {
        if (response.success) {
          this.editors = response.data;
        } else {
          this.snackBar.open(response.error);
        }
      });
  }

  onRemoveEditor(editor: DiscordUser) {
    this.workshopService.removeCollectionEditor(this.collection._id, editor.id)
      .subscribe(response => {
        if (response.success) {
          this.editors = response.data;
        } else {
          this.snackBar.open(response.error);
        }
      });
  }

  onEditSettings() {
    const dialogRef: MatDialogRef<EditSettingsDialogComponent, WorkshopCollection> = this.dialog.open(
      EditSettingsDialogComponent,
      {
        disableClose: true,
        data: {collection: this.collection}
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.collection = {...this.collection, ...result};
      }
    });
  }

  onPublish() {
    const dialogRef: MatDialogRef<PublishDialogComponent, WorkshopCollection> = this.dialog.open(
      PublishDialogComponent,
      {
        disableClose: true,
        maxWidth: 'max(50%, 350px)',
        data: {collection: this.collection}
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.collection = {...this.collection, ...result};
      }
    });
  }

  onCreateNewAlias() {

  }

  onCreateNewSnippet() {

  }

  // data loaders
  loadCollection(id: string) {
    this.workshopService.getCollectionFull(id)
      .subscribe(response => {
        this.loading = false;
        if (response.success) {
          this.onCollectionInit(response.data);
        } else {
          this.error = response.error;
        }
      });
  }

  loadOwner() {
    this.discordService.getUser(this.collection.owner)
      .subscribe(response => {
        this.owner = response;
      });
  }

  loadEditors() {
    this.workshopService.getCollectionEditors(this.collection._id)
      .subscribe(response => {
        if (response.success) {
          this.editors = response.data;
        }
      });
  }

  // helpers
  canEdit(): boolean {
    return this.editors?.some(editor => editor.id === getUser().id);
  }

  goBack() {
    this.location.back();
  }
}
