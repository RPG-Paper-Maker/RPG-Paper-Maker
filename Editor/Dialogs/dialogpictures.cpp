/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "dialogpictures.h"
#include "ui_dialogpictures.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogPictures::DialogPictures(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogPictures)
{
    ui->setupUi(this);
    
    ui->widgetPicturePreview->setAreNegIDsEnabled(false);

    // Tree model
    ui->treeView->setModel(createFoldersModel());
    ui->treeView->expandAll();
    connect(ui->treeView->selectionModel(),
            SIGNAL(currentChanged(QModelIndex,QModelIndex)),
            this,
            SLOT(on_folderSelected(QModelIndex,QModelIndex)));

    // Keep space when hiding widget
    QSizePolicy sp_retain;
    sp_retain = ui->widgetPicturePreview->sizePolicy();
    sp_retain.setRetainSizeWhenHidden(true);
    ui->widgetPicturePreview->setSizePolicy(sp_retain);
}

DialogPictures::~DialogPictures()
{
    delete ui->treeView->model();
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QStandardItemModel* DialogPictures::createFoldersModel() const{
    QStandardItemModel* model = new QStandardItemModel;
    QStandardItem* itemPictures, *itemHUD, *itemTextures2D;
    QIcon icon(":/icons/Ressources/dir.png");
    QList<QString> listNames;
    QList<PictureKind> listEnums;

    // Pictures
    itemPictures = new QStandardItem;
    itemPictures->setData(QVariant::fromValue(
                      reinterpret_cast<PictureKind>(PictureKind::None)));
    itemPictures->setIcon(icon);
    itemPictures->setText("Pictures");
    model->appendRow(itemPictures);

    // HUD
    itemHUD = new QStandardItem;
    itemHUD->setData(QVariant::fromValue(
                      reinterpret_cast<PictureKind>(PictureKind::None)));
    itemHUD->setIcon(icon);
    itemHUD->setText("HUD");
    itemPictures->appendRow(itemHUD);
    listNames << "Bars" << "Facesets" << "Icons" << "WindowSkins" <<
        "TitleScreen";
    listEnums << PictureKind::Bars << PictureKind::Facesets <<
        PictureKind::Icons << PictureKind::WindowSkins << PictureKind
        ::TitleScreen;
    addfolders(icon, itemHUD, listNames, listEnums);

    // Textures 2D
    itemTextures2D = new QStandardItem;
    itemTextures2D->setData(QVariant::fromValue(
                      reinterpret_cast<PictureKind>(PictureKind::None)));
    itemTextures2D->setIcon(icon);
    itemTextures2D->setText("Texures2D");
    itemPictures->appendRow(itemTextures2D);
    listNames.clear();
    listEnums.clear();
    listNames << "Autotiles" << "Battlers" << "Characters" << "Reliefs" <<
        "Tilesets" << "Walls" << "Objects 3D";
    listEnums << PictureKind::Autotiles << PictureKind::Battlers <<
        PictureKind::Characters << PictureKind::Reliefs << PictureKind::Tilesets
        << PictureKind::Walls << PictureKind::Object3D;
    addfolders(icon, itemTextures2D, listNames, listEnums);

    return model;
}

// -------------------------------------------------------

void DialogPictures::addfolders(QIcon &icon,
                                QStandardItem* root,
                                QList<QString> &names,
                                QList<PictureKind> &enums) const
{
    QStandardItem* item;

    for (int i = 0; i < names.size(); i++){
        item= new QStandardItem;
        item->setData(QVariant::fromValue(
                          reinterpret_cast<PictureKind>(enums.at(i))));
        item->setIcon(icon);
        item->setText(names.at(i));
        root->appendRow(item);
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogPictures::on_folderSelected(const QModelIndex& current,
                                       const QModelIndex&)
{
    QStandardItemModel* model = (QStandardItemModel*) ui->treeView->model();
    QStandardItem* item = model->itemFromIndex(current);
    PictureKind k = item->data().value<PictureKind>();
    ui->widgetPicturePreview->setPictureKind(k);
}
