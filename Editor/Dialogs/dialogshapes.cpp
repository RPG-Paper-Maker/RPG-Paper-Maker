/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QMimeData>
#include "dialogshapes.h"
#include "ui_dialogshapes.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogShapes::DialogShapes(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogShapes)
{
    ui->setupUi(this);

    ui->panelShapes->setAreNegIDsEnabled(false);
    ui->panelShapes->showAvailableContent(RPM::get()->engineSettings()
        ->showAvailableContent());

    // Tree model
    ui->treeView->setModel(createFoldersModel());
    ui->treeView->expandAll();
    connect(ui->treeView->selectionModel(), SIGNAL(currentChanged(QModelIndex,
        QModelIndex)), this, SLOT(on_folderSelected(QModelIndex, QModelIndex)));

    // Keep space when hiding widget
    QSizePolicy sp_retain;
    sp_retain = ui->panelShapes->sizePolicy();
    sp_retain.setRetainSizeWhenHidden(true);
    ui->panelShapes->setSizePolicy(sp_retain);
    this->setAcceptDrops(true);
    this->translate();
}

DialogShapes::~DialogShapes()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QStandardItemModel* DialogShapes::createFoldersModel() const{
    QStandardItemModel* model = new QStandardItemModel;
    QStandardItem* itemShapes;
    QIcon icon(":/icons/Ressources/dir.png");
    QList<QString> listNames;
    QList<CustomShapeKind> listEnums;

    // Shapes
    itemShapes = new QStandardItem;
    itemShapes->setData(QVariant::fromValue(reinterpret_cast<CustomShapeKind>(
        CustomShapeKind::None)));
    itemShapes->setIcon(icon);
    itemShapes->setText("Shapes");
    model->appendRow(itemShapes);

    // HUD
    listNames << "OBJ" << "MTL" << "Collisions";
    listEnums << CustomShapeKind::OBJ << CustomShapeKind::MTL << CustomShapeKind
        ::Collisions;
    addfolders(icon, itemShapes, listNames, listEnums);

    return model;
}

// -------------------------------------------------------

void DialogShapes::addfolders(QIcon &icon, QStandardItem* root, QList<QString>
    &names, QList<CustomShapeKind> &enums) const
{
    QStandardItem* item;

    for (int i = 0; i < names.size(); i++){
        item = new QStandardItem;
        item->setData(QVariant::fromValue(reinterpret_cast<CustomShapeKind>(
            enums.at(i))));
        item->setIcon(icon);
        item->setText(names.at(i));
        root->appendRow(item);
    }
}

//-------------------------------------------------

void DialogShapes::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SHAPES_MANAGER) + RPM
        ::DOT_DOT_DOT);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DialogShapes::dragEnterEvent(QDragEnterEvent *event)
{
    if (event->mimeData()->hasUrls()) {
        event->acceptProposedAction();
    }
}

// -------------------------------------------------------

void DialogShapes::dropEvent(QDropEvent *event)
{
    QList<QUrl> urls = event->mimeData()->urls();
    QStringList list;
    for (int i = 0, l = urls.size(); i < l; i++)
    {
        list << urls.at(i).toLocalFile();
    }
    ui->panelShapes->dropFiles(list);
}


// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogShapes::on_folderSelected(const QModelIndex& current, const QModelIndex&)
{
    QStandardItemModel* model = reinterpret_cast<QStandardItemModel *>(ui
        ->treeView->model());
    QStandardItem* item = model->itemFromIndex(current);
    CustomShapeKind k = item->data().value<CustomShapeKind>();
    ui->panelShapes->setShapeKind(k);
}
