/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogvideos.h"
#include "ui_dialogvideos.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogVideos::DialogVideos(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogVideos)
{
    ui->setupUi(this);

    ui->widgetVideoPreview->setAreNegIDsEnabled(false);
    ui->treeView->setModel(createFoldersModel());
    ui->treeView->expandAll();
    ui->widgetVideoPreview->setKind();
    ui->widgetVideoPreview->showAvailableContent(RPM::get()->engineSettings()
        ->showAvailableContent());

    this->translate();
}

DialogVideos::~DialogVideos() {
    delete ui->treeView->model();
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QStandardItemModel* DialogVideos::createFoldersModel() const {
    QStandardItemModel *model;
    QStandardItem *item;
    QIcon icon(":/icons/Ressources/dir.png");

    model = new QStandardItemModel;
    item = new QStandardItem;
    item->setIcon(icon);
    item->setText("Videos");
    model->appendRow(item);

    return model;
}

//-------------------------------------------------

void DialogVideos::translate()
{
    this->setWindowTitle(RPM::translate(Translations::VIDEOS_MANAGER) + RPM
        ::DOT_DOT_DOT);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}
