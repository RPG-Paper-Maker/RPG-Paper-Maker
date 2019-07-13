/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsetmaximum.h"
#include "ui_dialogsetmaximum.h"
#include "superlistitem.h"
#include <QMessageBox>

const QString DialogSetMaximum::STR_WARNING = "This maximum is incorrect "
    "because it will delete IDs. Please reorder your stuff properly.";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSetMaximum::DialogSetMaximum(QStandardItemModel* model, int max,
                                   QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSetMaximum),
    m_model(model)
{
    ui->setupUi(this);

    ui->spinBoxMaximum->setMaximum(max);
    ui->spinBoxMaximum->setValue(model->invisibleRootItem()->rowCount());
}

DialogSetMaximum::~DialogSetMaximum()
{
    delete ui;
}

int DialogSetMaximum::maximum() const { return ui->spinBoxMaximum->value(); }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool DialogSetMaximum::isOrderedMax(QStandardItemModel* model, int limit) {
    if (limit <= 0) {
        return false;
    }

    // If deleting stuff...
    if (limit < model->invisibleRootItem()->rowCount()){
        for (int i = 0; i < limit; i++){
            int id = reinterpret_cast<SuperListItem *>(model->item(i)->data()
                .value<quintptr>())->id();
            if (id > limit) {
                return false;
            }
        }

    }

    return true;
}

// -------------------------------------------------------

bool DialogSetMaximum::isOrdered(int limit) const{
    return isOrderedMax(m_model, limit);
}

// -------------------------------------------------------

void DialogSetMaximum::accept(){
    if (isOrdered(maximum()))
        QDialog::accept();
    else
        QMessageBox::information(this, "Warning", STR_WARNING);
}
