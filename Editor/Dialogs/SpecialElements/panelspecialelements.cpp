/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "panelspecialelements.h"
#include "ui_panelspecialelements.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelSpecialElements::PanelSpecialElements(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelSpecialElements),
    m_model(nullptr)
{
    ui->setupUi(this);

    // Calculate spacer sizes
    m_spacersSize.append(ui->horizontalSpacer->geometry().size());
    m_spacersSize.append(ui->horizontalSpacer_3->geometry().size());
    m_spacersSize.append(ui->horizontalSpacer_4->geometry().size());
    m_spacersSize.append(ui->horizontalSpacer_5->geometry().size());
    m_spacersSize.append(ui->horizontalSpacer_6->geometry().size());
    m_spacersSize.append(ui->horizontalSpacer_7->geometry().size());

    ui->comboBoxShape->addItems(RPM::ENUM_TO_STRING_SHAPE_KIND);
    ui->comboBoxCollision->addItems(RPM::ENUM_TO_STRING_OBJECT_COLLISION_KIND);
    ui->comboBoxCollisionMountains->addItems(RPM
        ::ENUM_TO_STRING_MOUNTAIN_COLLISION_KIND);
    ui->comboBoxStretch->addItem(RPM::translate(Translations::STRETCH));
    ui->comboBoxStretch->addItem(RPM::translate(Translations::PERFECT_SIZE));

    this->showBox();

    this->translate();
}

PanelSpecialElements::~PanelSpecialElements()
{
    delete ui;
}

int PanelSpecialElements::currentIndex() const {
    return this->superList()->list()->getIndex();
}

PanelSuperList *PanelSpecialElements::superList() const {
    return ui->panelSuperList;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelSpecialElements::initialize(QStandardItemModel *model, PictureKind
    kind)
{
    QModelIndex index;
    QModelIndex modelIndex;
    QVariant v(0);
    int i, l;

    m_model = model;
    m_kind = kind;

    // Temporary disable combobox shapes
    for (i = 1, l = 5; i < l; i++) {
        modelIndex = ui->comboBoxShape->model()->index(i, 0);
        ui->comboBoxShape->model()->setData(modelIndex, v, Qt::UserRole - 1);
    }
    modelIndex = ui->comboBoxCollision->model()->index(3, 0);
    ui->comboBoxCollision->model()->setData(modelIndex, v, Qt::UserRole - 1);

    // Update UI widgets visible according to kind
    if (m_kind == PictureKind::Object3D) {
        showObject3D();
    } else {
        hideObject3D();
    }
    if (m_kind == PictureKind::Mountains) {
        showMountain();
        ui->widgetShowPicture->setCover(true);
    } else {
        hideMountain();
    }

    // Initialize widgets and connections
    ui->panelSuperList->list()->initializeNewItemInstance(SuperListItem
        ::getnewInstance(kind));
    ui->panelSuperList->initializeModel(m_model);
    connect(ui->panelSuperList->list()->selectionModel(), SIGNAL(currentChanged(
        QModelIndex, QModelIndex)), this, SLOT(on_pageSelected(QModelIndex,
        QModelIndex)));
    ui->widgetPicture->setKind(kind);
    ui->widgetShapeObj->setKind(CustomShapeKind::OBJ);
    ui->widgetShapeMtl->setKind(CustomShapeKind::MTL);
    ui->widgetTilesetSettings->setKind(kind);
    if (kind == PictureKind::Walls) {
        ui->widgetTilesetSettings->deleteDirectionTab();
    }

    // Connections
    connect(ui->widgetPicture, SIGNAL(pictureChanged(SystemPicture *)), this,
        SLOT(on_pictureChanged(SystemPicture*)));
    connect(ui->widgetShapeObj, SIGNAL(shapeChanged()), this, SLOT(
        on_objChanged()));

    // By default, go to first item
    index = m_model->index(0, 0);
    ui->panelSuperList->list()->setIndex(0);
    on_pageSelected(index,index);
}

// -------------------------------------------------------

void PanelSpecialElements::update(SystemSpecialElement *sys) {
    SystemPicture *picture;

    ui->comboBoxShape->setCurrentIndex(static_cast<int>(sys->shapeKind()));
    ui->widgetShapeObj->initialize(sys->objID());
    ui->widgetShapeMtl->initialize(sys->mtlID());

    // Picture management
    picture = sys->picture();
    ui->widgetPicture->setPicture(picture);
    if (m_kind == PictureKind::Autotiles) {
        ui->widgetTilesetSettings->updateImageAutotile(picture);
    } else {
        ui->widgetTilesetSettings->updateImage(picture);
    }

    ui->comboBoxCollision->setCurrentIndex(static_cast<int>(sys->collisionKind()));
    ui->widgetShapeCollisions->initialize(sys->collisionCustomID());
    ui->doubleSpinBoxScale->setValue(sys->scale());
    ui->spinBoxSquaresWidth->setValue(sys->widthSquare());
    ui->spinBoxPixelsWidth->setValue(sys->widthPixel());
    ui->spinBoxSquaresHeight->setValue(sys->heightSquare());
    ui->spinBoxPixelsHeight->setValue(sys->heightPixel());
    ui->spinBoxSquaresDepth->setValue(sys->depthSquare());
    ui->spinBoxPixelsDepth->setValue(sys->depthPixel());
    ui->comboBoxStretch->setCurrentIndex(sys->stretch() ? 0 : 1);
    ui->comboBoxCollisionMountains->setCurrentIndex(static_cast<int>(sys
        ->mountainCollisionKind()));

    // Object previewer
    if (m_kind == PictureKind::Object3D) {
        ui->widgetPreviewObject3D->loadObject(reinterpret_cast<SystemObject3D *>
            (sys));
        ui->widgetPreviewObject3D->updateObject();
    }
    if (m_kind == PictureKind::Mountains) {
        ui->widgetShowPicture->updatePicture(picture, PictureKind::Mountains);
    }
}

// -------------------------------------------------------

void PanelSpecialElements::hideObject3D() {
    ui->horizontalSpacer->changeSize(0, 0);
    ui->horizontalSpacer_4->changeSize(0, 0);
    ui->horizontalSpacer_5->changeSize(0, 0);
    ui->horizontalSpacer_6->changeSize(0, 0);
    ui->labelShape->hide();
    ui->comboBoxShape->hide();
    ui->labelObject->hide();
    ui->widgetShapeObj->hide();
    ui->labelMtl->hide();
    ui->widgetShapeMtl->hide();
    ui->labelCollisions->hide();
    ui->comboBoxCollision->hide();
    ui->widgetShapeCollisions->hide();
    ui->labelScale->hide();
    ui->doubleSpinBoxScale->hide();
    ui->groupBoxSize->hide();
    ui->widgetPreviewObject3D->hide();
    ui->gridLayout_3->setRowStretch(8, 0);
}

// -------------------------------------------------------

void PanelSpecialElements::showObject3D() {
    ui->widgetTilesetSettings->hide();
    ui->gridLayout_3->setRowStretch(7, 0);
}

// -------------------------------------------------------

void PanelSpecialElements::hideMountain() {
    ui->scrollArea->hide();
    ui->gridLayout_3->setRowStretch(9, 0);
    ui->labelCollisionMountains->hide();
    ui->comboBoxCollisionMountains->hide();
    ui->horizontalSpacer_7->changeSize(0, 0);
}

// -------------------------------------------------------

void PanelSpecialElements::showMountain() {
    ui->widgetTilesetSettings->hide();
    ui->scrollArea->show();
    ui->gridLayout_3->setRowStretch(7, 0);

    ui->horizontalSpacer_7->changeSize(m_spacersSize.at(5).width(),
        m_spacersSize.at(5).height());
}

// -------------------------------------------------------

void PanelSpecialElements::showBox() {
    QModelIndex modelIndex;
    QVariant vDisable(0);
    QVariant vEnable(1 | 32);

    ui->horizontalSpacer_5->changeSize(0, 0);
    ui->horizontalSpacer_6->changeSize(0, 0);

    ui->labelObject->hide();
    ui->widgetShapeObj->hide();
    ui->labelMtl->hide();
    ui->widgetShapeMtl->hide();
    ui->widgetShapeCollisions->hide();
    ui->labelScale->hide();
    ui->doubleSpinBoxScale->hide();
    ui->groupBoxSize->show();

    modelIndex = ui->comboBoxCollision->model()->index(1, 0);
    ui->comboBoxCollision->model()->setData(modelIndex, vEnable, Qt::UserRole -
        1);
    modelIndex = ui->comboBoxCollision->model()->index(2, 0);
    ui->comboBoxCollision->model()->setData(modelIndex, vDisable, Qt::UserRole -
        1);
    if (ui->comboBoxCollision->currentIndex() == 2) {
        ui->comboBoxCollision->setCurrentIndex(1);
    }
}

// -------------------------------------------------------

void PanelSpecialElements::showCustomObject() {
    QModelIndex modelIndex;
    QVariant vDisable(0);
    QVariant vEnable(1 | 32);

    ui->horizontalSpacer_5->changeSize(m_spacersSize.at(3).width(),
        m_spacersSize.at(3).height());
    ui->horizontalSpacer_6->changeSize(m_spacersSize.at(4).width(),
        m_spacersSize.at(4).height());

    ui->labelObject->show();
    ui->widgetShapeObj->show();
    ui->labelMtl->show();
    ui->widgetShapeMtl->show();
    ui->widgetShapeCollisions->setVisible(currentElement()->collisionKind() ==
        ObjectCollisionKind::Custom);
    ui->labelScale->show();
    ui->doubleSpinBoxScale->show();
    ui->groupBoxSize->hide();

    modelIndex = ui->comboBoxCollision->model()->index(1, 0);
    ui->comboBoxCollision->model()->setData(modelIndex, vDisable, Qt::UserRole -
        1);
    modelIndex = ui->comboBoxCollision->model()->index(2, 0);
    ui->comboBoxCollision->model()->setData(modelIndex, vEnable, Qt::UserRole -
        1);
    if (ui->comboBoxCollision->currentIndex() == 1) {
        ui->comboBoxCollision->setCurrentIndex(2);
    }
}

// -------------------------------------------------------

void PanelSpecialElements::showCustomObjectCollision(bool b) {
    ui->widgetShapeCollisions->setVisible(b);
}

// -------------------------------------------------------

SystemSpecialElement * PanelSpecialElements::currentElement()
    const
{
    QStandardItem *selected;

    selected = this->superList()->list()->getSelected();
    if (selected != nullptr) {
        return reinterpret_cast<SystemSpecialElement *>(selected->data().value<
            quintptr>());
    }

    return nullptr;
}

//-------------------------------------------------

void PanelSpecialElements::translate()
{
    ui->labelMtl->setText(RPM::translate(Translations::MTL) + RPM::COLON);
    ui->labelDepth->setText(RPM::translate(Translations::DEPTH) + RPM::COLON);
    ui->labelScale->setText(RPM::translate(Translations::SCALE) + RPM::COLON);
    ui->labelShape->setText(RPM::translate(Translations::SHAPE) + RPM::COLON);
    ui->labelWidth->setText(RPM::translate(Translations::WIDTH) + RPM::COLON);
    ui->labelHeight->setText(RPM::translate(Translations::HEIGHT) + RPM::COLON);
    ui->labelObject->setText(RPM::translate(Translations::OBJECT) + RPM::COLON);
    ui->labelTexture->setText(RPM::translate(Translations::TEXTURE) + RPM::COLON);
    ui->labelCollisions->setText(RPM::translate(Translations::COLLISIONS) + RPM
        ::COLON);
    ui->labelDepthPixels->setText(RPM::translate(Translations::PIXEL_S));
    ui->labelSizeTexture->setText(RPM::translate(Translations::TEXTURE) + RPM
        ::COLON);
    ui->labelWidthPixels->setText(RPM::translate(Translations::PIXEL_S));
    ui->labelDepthSquares->setText(RPM::translate(Translations::SQUARE_S));
    ui->labelHeightPixels->setText(RPM::translate(Translations::PIXEL_S));
    ui->labelCollisionMountains->setText(RPM::translate(Translations::COLLISIONS
        ) + RPM::COLON);
    ui->labelWidthSquares->setText(RPM::translate(Translations::SQUARE_S));
    ui->labelHeightSquares->setText(RPM::translate(Translations::SQUARE_S));
    ui->groupBoxSize->setTitle(RPM::translate(Translations::SIZE));
    ui->groupBoxCompleteList->setTitle(RPM::translate(Translations
        ::COMPLETE_LIST));
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelSpecialElements::on_pageSelected(QModelIndex, QModelIndex) {
    SystemSpecialElement *element;

    element = this->currentElement();
    if (element != nullptr) {
        update(element);
    }
}

// -------------------------------------------------------

void PanelSpecialElements::on_comboBoxShape_currentIndexChanged(int index) {
    if (m_model == nullptr) {
        return;
    }

    SystemSpecialElement *element;

    element = this->currentElement();
    if (element != nullptr) {
        element->setShapeKind(static_cast<ShapeKind>(index));
        switch (element->shapeKind()) {
        case ShapeKind::Box:
            showBox();
            break;
        case ShapeKind::Custom:
            showCustomObject();
            break;
        default:
            break;
        }
        ui->widgetPreviewObject3D->loadObject(static_cast<SystemObject3D *>(
            element));
        ui->widgetPreviewObject3D->updateObject();
    }
}

// -------------------------------------------------------

void PanelSpecialElements::on_pictureChanged(SystemPicture *picture) {
    SystemSpecialElement *sys;

    sys = reinterpret_cast<SystemSpecialElement *>(ui->panelSuperList->list()
        ->getSelected()->data().value<quintptr>());
    sys->setPictureID(picture->id());
    if (m_kind == PictureKind::Autotiles) {
        ui->widgetTilesetSettings->updateImageAutotile(picture);
    } else {
        ui->widgetTilesetSettings->updateImage(picture);
    }
    ui->widgetPreviewObject3D->updateObject();
}

// -------------------------------------------------------

void PanelSpecialElements::on_objChanged() {
    SystemObject3D *element;

    element = reinterpret_cast<SystemObject3D *>(this->currentElement());
    ui->widgetPreviewObject3D->loadObject(element);
    ui->widgetPreviewObject3D->updateObject();
}

// -------------------------------------------------------

void PanelSpecialElements::on_comboBoxCollision_currentIndexChanged(int index) {
    if (m_model == nullptr) {
        return;
    }

    SystemSpecialElement *element;

    element = this->currentElement();
    if (element != nullptr) {
        element->setCollisionKind(static_cast<ObjectCollisionKind>(index));
        this->showCustomObjectCollision(element->collisionKind() ==
            ObjectCollisionKind::Custom);
    }
}

// -------------------------------------------------------

void PanelSpecialElements::on_doubleSpinBoxScale_valueChanged(double d) {
    SystemSpecialElement *element;

    element = this->currentElement();
    if (element != nullptr) {
        element->setScale(d);
        ui->widgetPreviewObject3D->updateObject();
    }
}

// -------------------------------------------------------

void PanelSpecialElements::on_spinBoxSquaresWidth_valueChanged(int i) {
    SystemSpecialElement *element;

    element = this->currentElement();
    if (element != nullptr) {
        element->setWidthSquare(i);
        ui->widgetPreviewObject3D->updateObject();
    }
}

// -------------------------------------------------------

void PanelSpecialElements::on_spinBoxPixelsWidth_valueChanged(int i) {
    SystemSpecialElement *element;

    element = this->currentElement();
    if (element != nullptr) {
        element->setWidthPixel(i);
        ui->widgetPreviewObject3D->updateObject();
    }
}

// -------------------------------------------------------

void PanelSpecialElements::on_spinBoxSquaresHeight_valueChanged(int i) {
    SystemSpecialElement *element;

    element = this->currentElement();
    if (element != nullptr) {
        element->setHeightSquare(i);
        ui->widgetPreviewObject3D->updateObject();
    }
}

// -------------------------------------------------------

void PanelSpecialElements::on_spinBoxPixelsHeight_valueChanged(int i) {
    SystemSpecialElement *element;

    element = this->currentElement();
    if (element != nullptr) {
        element->setHeightPixel(i);
        ui->widgetPreviewObject3D->updateObject();
    }
}

// -------------------------------------------------------

void PanelSpecialElements::on_spinBoxSquaresDepth_valueChanged(int i) {
    SystemSpecialElement *element;

    element = this->currentElement();
    if (element != nullptr) {
        element->setDepthSquare(i);
        ui->widgetPreviewObject3D->updateObject();
    }
}

// -------------------------------------------------------

void PanelSpecialElements::on_spinBoxPixelsDepth_valueChanged(int i) {
    SystemSpecialElement *element;

    element = this->currentElement();
    if (element != nullptr) {
        element->setDepthPixel(i);
        ui->widgetPreviewObject3D->updateObject();
    }
}

// -------------------------------------------------------

void PanelSpecialElements::on_comboBoxStretch_currentIndexChanged(int index) {
    if (m_model == nullptr) {
        return;
    }

    SystemSpecialElement *element;

    element = this->currentElement();
    if (element != nullptr) {
        element->setStretch(index == 0);
        ui->widgetPreviewObject3D->updateObject();
    }
}

// -------------------------------------------------------

void PanelSpecialElements::on_comboBoxCollisionMountains_currentIndexChanged(int
    index)
{
    if (m_model == nullptr) {
        return;
    }

    SystemSpecialElement *element;

    element = this->currentElement();
    if (element != nullptr) {
        element->setMountainCollisionKind(static_cast<MountainCollisionKind>(
            index));
    }
}
