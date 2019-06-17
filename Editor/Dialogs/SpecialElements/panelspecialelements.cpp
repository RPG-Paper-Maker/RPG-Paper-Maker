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
}

PanelSpecialElements::~PanelSpecialElements()
{
    delete ui;
}

int PanelSpecialElements::currentIndex() const {
    return superList()->list()->getIndex();
}

PanelSuperList *PanelSpecialElements::superList() const {
    return ui->panelSuperList;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelSpecialElements::initialize(QStandardItemModel* model, PictureKind
    kind)
{
    m_model = model;
    m_kind = kind;

    if (m_kind == PictureKind::Object3D) {
        showObject3D();
    } else {
        hideObject3D();
    }

    ui->panelSuperList->list()->initializeNewItemInstance(
                SuperListItem::getnewInstance(kind));
    ui->panelSuperList->initializeModel(m_model);
    connect(ui->panelSuperList->list()->selectionModel(),
            SIGNAL(currentChanged(QModelIndex,QModelIndex)), this,
            SLOT(on_pageSelected(QModelIndex,QModelIndex)));
    ui->widgetPicture->setKind(kind);
    ui->widgetShapeObj->setKind(CustomShapeKind::OBJ);
    ui->widgetTilesetSettings->setKind(kind);
    if (kind == PictureKind::Walls)
        ui->widgetTilesetSettings->deleteDirectionTab();

    connect(ui->widgetPicture, SIGNAL(pictureChanged(SystemPicture*)),
            this, SLOT(on_pictureChanged(SystemPicture*)));
    QModelIndex index = m_model->index(0,0);
    ui->panelSuperList->list()->setIndex(0);
    on_pageSelected(index,index);
}

// -------------------------------------------------------

void PanelSpecialElements::update(SystemSpecialElement* sys) {
    SystemPicture* picture = sys->picture();
    ui->widgetPicture->setPicture(picture);
    ui->widgetShapeObj->initialize(sys->objID());
    if (m_kind == PictureKind::Autotiles)
        ui->widgetTilesetSettings->updateImageAutotile(picture);
    else
        ui->widgetTilesetSettings->updateImage(picture);
}

// -------------------------------------------------------

void PanelSpecialElements::hideObject3D() {
    ui->horizontalSpacer->changeSize(0, 0);
    ui->horizontalSpacer_2->changeSize(0, 0);
    ui->horizontalSpacer_4->changeSize(0, 0);
    ui->horizontalSpacer_5->changeSize(0, 0);
    ui->horizontalSpacer_8->changeSize(0, 0);
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
//
//  SLOTS
//
// -------------------------------------------------------

void PanelSpecialElements::on_pageSelected(QModelIndex index, QModelIndex) {
    QStandardItem* selected = m_model->itemFromIndex(index);
    if (selected != nullptr)
        update((SystemSpecialElement*) selected->data().value<quintptr>());
}

// -------------------------------------------------------

void PanelSpecialElements::on_pictureChanged(SystemPicture* picture) {
    SystemSpecialElement* sys = (SystemSpecialElement*) ui->panelSuperList
            ->list()->getSelected()->data().value<quintptr>();
    sys->setPictureID(picture->id());
    ui->widgetTilesetSettings->updateImage(picture);
}
