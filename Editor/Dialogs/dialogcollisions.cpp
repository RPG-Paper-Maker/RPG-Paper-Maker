/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcollisions.h"
#include "ui_dialogcollisions.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCollisions::DialogCollisions(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogCollisions)
{
    ui->setupUi(this);
    
    this->initializeTilesets();
    this->initializeCharacters();
    this->initializeAutotiles();
    this->initializeWalls();
    this->initializeMountains();
    this->initializeObjects3D();

    this->translate();
}

DialogCollisions::~DialogCollisions()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCollisions::disablePanelListEdition(PanelSuperList* panel) {
    panel->showEditName(false);
    panel->showButtonMax(false);
    panel->list()->setHasContextMenu(false);
    panel->list()->setCanDragAndDrop(false);
}

// -------------------------------------------------------

void DialogCollisions::initializeTilesets() {

    // Initialize name & pictures
    ui->panelSuperListTilesets->list()->initializeNewItemInstance(
                new SystemTileset);
    ui->panelSuperListTilesets->initializeModel(RPM::get()->project()
                                                ->gameDatas()->tilesetsDatas()
                                                ->model());
    connect(ui->panelSuperListTilesets->list()->selectionModel(),
            SIGNAL(currentChanged(QModelIndex,QModelIndex)), this,
            SLOT(on_tilesetSelected(QModelIndex,QModelIndex)));
    ui->widgetTilesetPictureSettings->setKind(PictureKind::Tilesets);
    disablePanelListEdition(ui->panelSuperListTilesets);

    // Select the first tileset
    QModelIndex index = ui->panelSuperListTilesets->list()->getModel()
            ->index(0,0);
    ui->panelSuperListTilesets->list()->setIndex(0);
    on_tilesetSelected(index,index);
}

// -------------------------------------------------------

void DialogCollisions::updateTileset(SystemTileset* tileset) {
    SystemPicture* picture = tileset->picture();
    ui->widgetTilesetPictureSettings->updateImage(picture);
}

// -------------------------------------------------------

void DialogCollisions::initializeCharacters() {

    // Initialize name & pictures
    ui->panelSuperListCharacters->list()->initializeNewItemInstance(
                new SystemPicture);
    ui->panelSuperListCharacters->list()->setAreNegIDsEnabled(false);
    ui->panelSuperListCharacters->initializeModel(RPM::get()->project()
                                              ->picturesDatas()
                                              ->model(PictureKind::Characters));
    connect(ui->panelSuperListCharacters->list()->selectionModel(),
            SIGNAL(currentChanged(QModelIndex,QModelIndex)), this,
            SLOT(on_characterSelected(QModelIndex,QModelIndex)));
    ui->widgetCharacterPraticable->setKind(PictureKind::Characters);
    ui->widgetCharacterPraticable->deleteDirectionTab();
    ui->widgetCharacterPraticable->showRepeat();
    disablePanelListEdition(ui->panelSuperListCharacters);

    // Select the first tileset
    QModelIndex index = ui->panelSuperListCharacters->list()->getModel()
            ->index(0,0);
    ui->panelSuperListCharacters->list()->setIndex(0);
    on_characterSelected(index,index);
}

// -------------------------------------------------------

void DialogCollisions::updateCharacter(SystemPicture* picture) {
    ui->widgetCharacterPraticable->updateImage(picture);
    ui->widgetCharacterPraticable->disableNone(picture->id() == -1);
}

// -------------------------------------------------------

void DialogCollisions::initializeAutotiles() {

    // Initialize name & pictures
    ui->panelSuperListAutotiles->list()->initializeNewItemInstance(
                new SystemAutotile);
    ui->panelSuperListAutotiles->initializeModel(RPM::get()->project()
                                                 ->specialElementsDatas()
                                                 ->modelAutotiles());
    connect(ui->panelSuperListAutotiles->list()->selectionModel(),
            SIGNAL(currentChanged(QModelIndex,QModelIndex)), this,
            SLOT(on_autotileSelected(QModelIndex,QModelIndex)));
    ui->widgetAutotilePictureSettings->setKind(PictureKind::Autotiles);
    disablePanelListEdition(ui->panelSuperListAutotiles);

    // Select the first tileset
    QModelIndex index = ui->panelSuperListAutotiles->list()->getModel()
            ->index(0,0);
    ui->panelSuperListAutotiles->list()->setIndex(0);
    on_autotileSelected(index,index);
}

// -------------------------------------------------------

void DialogCollisions::updateAutotile(SystemAutotile* autotile) {
    SystemPicture* picture = autotile->picture();
    ui->widgetAutotilePictureSettings->updateImageAutotile(picture);
}

// -------------------------------------------------------

void DialogCollisions::initializeWalls() {

    // Initialize name & pictures
    ui->panelSuperListWalls->list()->initializeNewItemInstance(
                new SystemSpriteWall);
    ui->panelSuperListWalls->initializeModel(RPM::get()->project()
                                             ->specialElementsDatas()
                                             ->modelSpriteWalls());
    connect(ui->panelSuperListWalls->list()->selectionModel(),
            SIGNAL(currentChanged(QModelIndex,QModelIndex)), this,
            SLOT(on_wallSelected(QModelIndex,QModelIndex)));
    ui->widgetWallPraticable->setKind(PictureKind::Walls);
    ui->widgetWallPraticable->deleteDirectionTab();
    disablePanelListEdition(ui->panelSuperListWalls);

    // Select the first tileset
    QModelIndex index = ui->panelSuperListWalls->list()->getModel()
            ->index(0,0);
    ui->panelSuperListWalls->list()->setIndex(0);
    on_wallSelected(index,index);
}

// -------------------------------------------------------

void DialogCollisions::updateWall(SystemSpriteWall *wall) {
    SystemPicture* picture = wall->picture();
    ui->widgetWallPraticable->updateImage(picture);
    ui->widgetWallPraticable->disableNone(picture->id() == -1);
}

// -------------------------------------------------------

void DialogCollisions::initializeMountains() {
    QModelIndex index;

    ui->panelSuperListMountains->list()->initializeNewItemInstance(new
        SystemMountain);
    ui->panelSuperListMountains->initializeModel(RPM::get()->project()
        ->specialElementsDatas()->modelMountains());
    this->connect(ui->panelSuperListMountains->list()->selectionModel(), SIGNAL(
        currentChanged(QModelIndex, QModelIndex)), this, SLOT(
        on_mountainSelected(QModelIndex, QModelIndex)));
    ui->widgetShowPicture->setCover(true);
    ui->comboBoxCollisionMountains->addItems(RPM
        ::ENUM_TO_STRING_MOUNTAIN_COLLISION_KIND);

    // Select the first mountain
    index = ui->panelSuperListMountains->list()->getModel()->index(0, 0);
    ui->panelSuperListMountains->list()->setIndex(0);
    this->on_mountainSelected(index, index);
}

// -------------------------------------------------------

void DialogCollisions::updateMountain(SystemMountain *mountain) {
    SystemPicture *picture;

    // Picture management
    picture = mountain->picture();
    ui->widgetShowPicture->updatePicture(picture, PictureKind::Mountains);

    // Collisions
    ui->comboBoxCollisionMountains->setCurrentIndex(static_cast<int>(mountain
        ->mountainCollisionKind()));
}

// -------------------------------------------------------

void DialogCollisions::initializeObjects3D() {
    QModelIndex index, modelIndex;
    QVariant v(0);

    // List
    ui->panelSuperListObjects3D->list()->initializeNewItemInstance(new
        SystemObject3D);
    ui->panelSuperListObjects3D->initializeModel(RPM::get()->project()
        ->specialElementsDatas()->modelObjects3D());
    this->connect(ui->panelSuperListObjects3D->list()->selectionModel(), SIGNAL(
        currentChanged(QModelIndex, QModelIndex)), this, SLOT(
        on_object3DSelected(QModelIndex, QModelIndex)));

    // Disable comobox
    ui->comboBoxCollisionObject3D->addItems(RPM
        ::ENUM_TO_STRING_OBJECT_COLLISION_KIND);
    modelIndex = ui->comboBoxCollisionObject3D->model()->index(3, 0);
    ui->comboBoxCollisionObject3D->model()->setData(modelIndex, v, Qt::UserRole
        - 1);

    // Select the first 3D object
    index = ui->panelSuperListObjects3D->list()->getModel()->index(0, 0);
    ui->panelSuperListObjects3D->list()->setIndex(0);
    this->on_object3DSelected(index, index);
}

// -------------------------------------------------------

void DialogCollisions::updateObject3D(SystemObject3D *object) {
    QVariant vDisable(0);
    QVariant vEnable(1 | 32);
    QModelIndex modelIndex;

    // Collisions
    ui->comboBoxCollisionObject3D->setCurrentIndex(static_cast<int>(object
        ->collisionKind()));
    ui->widgetShapeCollisions->initialize(object->collisionCustomID());
    switch (object->shapeKind()) {
    case ShapeKind::Box:
        ui->widgetShapeCollisions->hide();
        modelIndex = ui->comboBoxCollisionObject3D->model()->index(1, 0);
        ui->comboBoxCollisionObject3D->model()->setData(modelIndex, vEnable,
            Qt::UserRole - 1);
        modelIndex = ui->comboBoxCollisionObject3D->model()->index(2, 0);
        ui->comboBoxCollisionObject3D->model()->setData(modelIndex, vDisable, Qt
            ::UserRole - 1);
        if (ui->comboBoxCollisionObject3D->currentIndex() == 2) {
            ui->comboBoxCollisionObject3D->setCurrentIndex(1);
        }
        break;
    case ShapeKind::Custom:
        ui->widgetShapeCollisions->setVisible(object->collisionKind() ==
            ObjectCollisionKind::Custom);
        modelIndex = ui->comboBoxCollisionObject3D->model()->index(1, 0);
        ui->comboBoxCollisionObject3D->model()->setData(modelIndex, vDisable, Qt
            ::UserRole - 1);
        modelIndex = ui->comboBoxCollisionObject3D->model()->index(2, 0);
        ui->comboBoxCollisionObject3D->model()->setData(modelIndex, vEnable, Qt
            ::UserRole - 1);
        if (ui->comboBoxCollisionObject3D->currentIndex() == 1) {
            ui->comboBoxCollisionObject3D->setCurrentIndex(2);
        }
        break;
    default:
        break;
    }

    // Object previewer
    ui->widgetPreviewObject3D->loadObject(object);
    ui->widgetPreviewObject3D->updateObject();
}

// -------------------------------------------------------

void DialogCollisions::translate() {
    this->setWindowTitle(RPM::translate(Translations::COLLISIONS_MANAGER));
    ui->tabWidget->setTabText(0, RPM::translate(Translations::TILESETS));
    ui->groupBoxTilesets->setTitle(RPM::translate(Translations::TILESETS));
    ui->tabWidget->setTabText(1, RPM::translate(Translations::CHARACTERS));
    ui->groupBoxCharacters->setTitle(RPM::translate(Translations::CHARACTERS));
    ui->tabWidget->setTabText(2, RPM::translate(Translations::AUTOTILES));
    ui->groupBoxAutotiles->setTitle(RPM::translate(Translations::AUTOTILES));
    ui->tabWidget->setTabText(3, RPM::translate(Translations::WALLS));
    ui->groupBoxWalls->setTitle(RPM::translate(Translations::WALLS));
    ui->tabWidget->setTabText(4, RPM::translate(Translations::MOUNTAINS));
    ui->groupBoxMountains->setTitle(RPM::translate(Translations::MOUNTAINS));
    ui->labelCollisionMountains->setText(RPM::translate(Translations::COLLISIONS
        ) + RPM::COLON);
    ui->tabWidget->setTabText(5, RPM::translate(Translations::THREED_OBJECTS));
    ui->groupBoxObjects3D->setTitle(RPM::translate(Translations::THREED_OBJECTS));
    ui->labelCollisionsO->setText(RPM::translate(Translations::COLLISIONS) + RPM
        ::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCollisions::on_tilesetSelected(QModelIndex index, QModelIndex) {
    QStandardItem* selected = ui->panelSuperListTilesets->list()->getModel()
            ->itemFromIndex(index);
    if (selected != nullptr)
        updateTileset((SystemTileset*)selected->data().value<quintptr>());
}

// -------------------------------------------------------

void DialogCollisions::on_characterSelected(QModelIndex index, QModelIndex) {
    QStandardItem* selected = ui->panelSuperListCharacters->list()->getModel()
            ->itemFromIndex(index);
    if (selected != nullptr)
        updateCharacter((SystemPicture*)selected->data().value<quintptr>());
}

// -------------------------------------------------------

void DialogCollisions::on_autotileSelected(QModelIndex index, QModelIndex) {
    QStandardItem* selected = ui->panelSuperListAutotiles->list()->getModel()
            ->itemFromIndex(index);
    if (selected != nullptr)
        updateAutotile((SystemAutotile*)selected->data().value<quintptr>());
}

// -------------------------------------------------------

void DialogCollisions::on_wallSelected(QModelIndex index, QModelIndex) {
    QStandardItem* selected = ui->panelSuperListWalls->list()->getModel()
            ->itemFromIndex(index);
    if (selected != nullptr)
        updateWall((SystemSpriteWall*)selected->data().value<quintptr>());
}

// -------------------------------------------------------

void DialogCollisions::on_mountainSelected(QModelIndex index, QModelIndex) {
    QStandardItem *selected;

    selected = ui->panelSuperListMountains->list()->getModel()->itemFromIndex(
        index);
    if (selected != nullptr) {
        this->updateMountain(reinterpret_cast<SystemMountain *>(selected->data()
            .value<quintptr>()));
    }
}

// -------------------------------------------------------

void DialogCollisions::on_object3DSelected(QModelIndex index, QModelIndex) {
    QStandardItem *selected;

    selected = ui->panelSuperListObjects3D->list()->getModel()->itemFromIndex(
        index);
    if (selected != nullptr) {
        this->updateObject3D(reinterpret_cast<SystemObject3D *>(selected->data()
            .value<quintptr>()));
    }
}

// -------------------------------------------------------

void DialogCollisions::on_comboBoxCollisionMountains_currentIndexChanged(int
    index)
{
    QStandardItem *item;
    SystemMountain *mountain;

    item = ui->panelSuperListMountains->list()->getSelected();

    if (item != nullptr) {
        mountain = reinterpret_cast<SystemMountain *>(item->data().value<
            quintptr>());
        if (mountain != nullptr) {
            mountain->setMountainCollisionKind(static_cast<MountainCollisionKind
                >(index));
        }
    }
}

// -------------------------------------------------------

void DialogCollisions::on_comboBoxCollisionObject3D_currentIndexChanged(int
    index)
{
    QStandardItem *item;
    SystemObject3D *object;

    item = ui->panelSuperListObjects3D->list()->getSelected();

    if (item != nullptr) {
        object = reinterpret_cast<SystemObject3D *>(item->data().value<quintptr>());
        if (object != nullptr) {
            object->setCollisionKind(static_cast<ObjectCollisionKind>(index));
            ui->widgetShapeCollisions->setVisible(object->collisionKind() ==
                ObjectCollisionKind::Custom);
        }
    }
}
