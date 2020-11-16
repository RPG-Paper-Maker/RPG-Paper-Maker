/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "widgetcustomstructure.h"
#include "ui_widgetcustomstructure.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetCustomStructure::WidgetCustomStructure(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::WidgetCustomStructure)
{
    ui->setupUi(this);

    ui->listWidget->addItem(new QListWidgetItem);
}

WidgetCustomStructure::~WidgetCustomStructure()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetCustomStructure::initialize(SystemCustomStructure *custom)
{
    m_custom = custom;
    ui->listWidget->item(0)->setText(custom->toString());
}

// -------------------------------------------------------

void WidgetCustomStructure::openDialog()
{
    m_custom->openDialog();
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void WidgetCustomStructure::on_listWidget_itemDoubleClicked(QListWidgetItem *)
{
    this->openDialog();
}

// -------------------------------------------------------

void WidgetCustomStructure::on_pushButton_clicked()
{
    this->openDialog();
}
