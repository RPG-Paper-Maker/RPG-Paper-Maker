/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogenternameoptions.h"
#include "ui_dialogenternameoptions.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogEnterNameOptions::DialogEnterNameOptions(QList<
    QList<QString>> &table, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogEnterNameOptions)
{
    ui->setupUi(this);

    int rows = table.size();
    int columns = table.at(0).size();
    ui->tableWidget->horizontalHeader()->setDefaultSectionSize(40);
    ui->spinBoxRows->setValue(rows);
    ui->spinBoxColumns->setValue(columns);
    ui->tableWidget->horizontalHeader()->hide();
    ui->tableWidget->verticalHeader()->hide();
    QList<QString> list;
    for (int i = 0; i < rows; i++)
    {
        list = table.at(i);
        for (int j = 0; j < columns; j++)
        {
            ui->tableWidget->setItem(i, j, new QTableWidgetItem(list.at(j)));
        }
    }
    this->translate();
}

DialogEnterNameOptions::~DialogEnterNameOptions()
{
    delete ui;
}

QList<QList<QString>> DialogEnterNameOptions::table() const
{
    QList<QList<QString>> table;
    QList<QString> list;
    QTableWidgetItem *item;
    for (int i = 0, l = ui->spinBoxRows->value(); i < l; i++)
    {
        list = QList<QString>();
        for (int j = 0, m = ui->spinBoxColumns->value(); j < m; j++)
        {
            item = ui->tableWidget->item(i, j);
            list.append(item == nullptr ? " " : item->text());
        }
        table.append(list);
    }
    return table;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogEnterNameOptions::translate()
{
    this->setWindowTitle(RPM::translate(Translations::ENTER_NAME_OPTIONS) + RPM
        ::DOT_DOT_DOT);
    ui->labelRows->setText(RPM::translate(Translations::ROWS) + RPM::COLON);
    ui->labelColumns->setText(RPM::translate(Translations::COLUMNS) + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogEnterNameOptions::on_spinBoxRows_valueChanged(int i)
{
    ui->tableWidget->setRowCount(i);
}

// -------------------------------------------------------

void DialogEnterNameOptions::on_spinBoxColumns_valueChanged(int i)
{
    ui->tableWidget->setColumnCount(i);
}
