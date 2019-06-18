/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    ui(new Ui::PanelSpecialElements)
{
    ui->setupUi(this);

    // Calculate spacer sizes
    m_spacersSize.append(ui->horizontalSpacer->geometry().size());
    m_spacersSize.append(ui->horizontalSpacer_2->geometry().size());
    m_spacersSize.append(ui->horizontalSpacer_3->geometry().size());
    m_spacersSize.append(ui->horizontalSpacer_4->geometry().size());
    m_spacersSize.append(ui->horizontalSpacer_5->geometry().size());
    m_spacersSize.append(ui->horizontalSpacer_6->geometry().size());

    this->showBox();
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

    // Update UI widgets visible according to kind
    if (m_kind == PictureKind::Object3D) {
        showObject3D();
    } else {
        hideObject3D();
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
    ui->widgetTilesetSettings->setKind(kind);
    if (kind == PictureKind::Walls) {
        ui->widgetTilesetSettings->deleteDirectionTab();
    }
    connect(ui->widgetPicture, SIGNAL(pictureChanged(SystemPicture *)), this,
        SLOT(on_pictureChanged(SystemPicture*)));

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
    ui->comboBoxLocation->setCurrentIndex(sys->location() ? 0 : 1);
    ui->doubleSpinBoxScale->setValue(sys->scale());
    ui->spinBoxSquaresWidth->setValue(sys->widthSquare());
    ui->spinBoxPixelsWidth->setValue(sys->widthPixel());
    ui->spinBoxSquaresHeight->setValue(sys->heightSquare());
    ui->spinBoxPixelsHeight->setValue(sys->heightPixel());
    ui->spinBoxSquaresDepth->setValue(sys->depthSquare());
    ui->spinBoxPixelsDepth->setValue(sys->depthPixel());
}

// -------------------------------------------------------

void PanelSpecialElements::hideObject3D() {
    ui->horizontalSpacer->changeSize(0, 0);
    ui->horizontalSpacer_2->changeSize(0, 0);
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
    ui->labelLocation->hide();
    ui->comboBoxLocation->hide();
    ui->labelScale->hide();
    ui->doubleSpinBoxScale->hide();
    ui->groupBoxSize->hide();
}

// -------------------------------------------------------

void PanelSpecialElements::showObject3D() {
    ui->widgetTilesetSettings->hide();
}

// -------------------------------------------------------

void PanelSpecialElements::showBox() {
    ui->horizontalSpacer->changeSize(0, 0);
    ui->horizontalSpacer_2->changeSize(0, 0);
    ui->horizontalSpacer_5->changeSize(0, 0);
    ui->horizontalSpacer_6->changeSize(0, 0);

    ui->labelObject->hide();
    ui->widgetShapeObj->hide();
    ui->labelMtl->hide();
    ui->widgetShapeMtl->hide();
    ui->labelCollisions->hide();
    ui->comboBoxCollision->hide();
    ui->widgetShapeCollisions->hide();
    ui->labelScale->hide();
    ui->doubleSpinBoxScale->hide();
    ui->groupBoxSize->show();
}

// -------------------------------------------------------

void PanelSpecialElements::showCustomObject() {
    ui->horizontalSpacer->changeSize(m_spacersSize.at(0).width(),
        m_spacersSize.at(0).height());
    ui->horizontalSpacer_2->changeSize(m_spacersSize.at(1).width(),
        m_spacersSize.at(1).height());
    ui->horizontalSpacer_5->changeSize(m_spacersSize.at(4).width(),
        m_spacersSize.at(4).height());
    ui->horizontalSpacer_6->changeSize(m_spacersSize.at(5).width(),
        m_spacersSize.at(5).height());

    ui->labelObject->show();
    ui->widgetShapeObj->show();
    ui->labelMtl->show();
    ui->widgetShapeMtl->show();
    ui->labelCollisions->show();
    ui->comboBoxCollision->show();
    ui->widgetShapeCollisions->setVisible(currentElement()->collisionKind() ==
        ObjectCollisionKind::Custom);
    ui->labelScale->show();
    ui->doubleSpinBoxScale->show();
    ui->groupBoxSize->hide();
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
    }
}

// -------------------------------------------------------

void PanelSpecialElements::on_pictureChanged(SystemPicture *picture) {
    SystemSpecialElement *sys;

    sys = reinterpret_cast<SystemSpecialElement *>(ui->panelSuperList->list()
        ->getSelected()->data().value<quintptr>());
    sys->setPictureID(picture->id());
    ui->widgetTilesetSettings->updateImage(picture);
}

// -------------------------------------------------------

void PanelSpecialElements::on_comboBoxCollision_currentIndexChanged(int index) {
    SystemSpecialElement *element;

    element = this->currentElement();
    if (element != nullptr) {
        element->setCollisionKind(static_cast<ObjectCollisionKind>(index));
        this->showCustomObjectCollision(element->collisionKind() ==
            ObjectCollisionKind::Custom);
    }
}

// -------------------------------------------------------

void PanelSpecialElements::on_comboBoxLocation_currentIndexChanged(int index) {
    SystemSpecialElement *element;

    element = this->currentElement();
    if (element != nullptr) {
        element->setLocation(index == 0);
    }
}

// -------------------------------------------------------

void PanelSpecialElements::on_doubleSpinBoxScale_valueChanged(double d) {
    SystemSpecialElement *element;

    element = this->currentElement();
    if (element != nullptr) {
        element->setScale(d);
    }
}

// -------------------------------------------------------

void PanelSpecialElements::on_spinBoxSquaresWidth_valueChanged(int i) {
    SystemSpecialElement *element;

    element = this->currentElement();
    if (element != nullptr) {
        element->setWidthSquare(i);
    }
}

// -------------------------------------------------------

void PanelSpecialElements::on_spinBoxPixelsWidth_valueChanged(int i) {
    SystemSpecialElement *element;

    element = this->currentElement();
    if (element != nullptr) {
        element->setWidthPixel(i);
    }
}

// -------------------------------------------------------

void PanelSpecialElements::on_spinBoxSquaresHeight_valueChanged(int i) {
    SystemSpecialElement *element;

    element = this->currentElement();
    if (element != nullptr) {
        element->setHeightSquare(i);
    }
}

// -------------------------------------------------------

void PanelSpecialElements::on_spinBoxPixelsHeight_valueChanged(int i) {
    SystemSpecialElement *element;

    element = this->currentElement();
    if (element != nullptr) {
        element->setHeightPixel(i);
    }
}

// -------------------------------------------------------

void PanelSpecialElements::on_spinBoxSquaresDepth_valueChanged(int i) {
    SystemSpecialElement *element;

    element = this->currentElement();
    if (element != nullptr) {
        element->setDepthSquare(i);
    }
}

// -------------------------------------------------------

void PanelSpecialElements::on_spinBoxPixelsDepth_valueChanged(int i) {
    SystemSpecialElement *element;

    element = this->currentElement();
    if (element != nullptr) {
        element->setDepthPixel(i);
    }
}
