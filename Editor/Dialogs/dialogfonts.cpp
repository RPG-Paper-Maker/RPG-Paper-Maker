/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogfonts.h"
#include "ui_dialogfonts.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogFonts::DialogFonts(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogFonts)
{
    ui->setupUi(this);
    ui->panelFonts->setAreNegIDsEnabled(false);
    ui->treeView->setModel(createFoldersModel());
    ui->treeView->expandAll();
    ui->panelFonts->setKind();
    ui->panelFonts->showAvailableContent(RPM::get()->engineSettings()
        ->showAvailableContent());
    this->translate();
}

DialogFonts::~DialogFonts()
{
    delete ui->treeView->model();
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QStandardItemModel* DialogFonts::createFoldersModel() const
{
    QStandardItemModel *model;
    QStandardItem *item;
    QIcon icon(":/icons/Ressources/dir.png");
    model = new QStandardItemModel;
    item = new QStandardItem;
    item->setIcon(icon);
    item->setText("Fonts");
    model->appendRow(item);
    return model;
}

//-------------------------------------------------

void DialogFonts::translate()
{
    this->setWindowTitle(RPM::translate(Translations::FONTS_MANAGER) + RPM
        ::DOT_DOT_DOT);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}
