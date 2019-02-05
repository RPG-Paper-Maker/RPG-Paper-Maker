/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#include "dialogsetmaximum.h"
#include "ui_dialogsetmaximum.h"
#include "superlistitem.h"
#include <QMessageBox>

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

bool DialogSetMaximum::isOrdered(int limit) const{

    // If deleting stuff...
    if (limit < m_model->invisibleRootItem()->rowCount()){
        for (int i = 0; i < limit; i++){
            int id = ((SuperListItem*) m_model->item(i)->data()
                      .value<quintptr>())->id();
            if (id > limit) return false;
        }

    }

    return true;
}

// -------------------------------------------------------

void DialogSetMaximum::accept(){
    if (isOrdered(maximum()))
        QDialog::accept();
    else
        QMessageBox::information(this, "Warning",
                                 "This maximum is incorrect because it will "
                                 "delete IDs. Please reorder your stuff "
                                 "properly.");
}
