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

#include "panelsuperlist.h"
#include "ui_panelsuperlist.h"
#include "dialogsetmaximum.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelSuperList::PanelSuperList(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelSuperList),
    m_maximum(9999),
    m_isLang(false)
{
    ui->setupUi(this);
    ui->widgetTextLang->hide();
}

PanelSuperList::~PanelSuperList()
{
    delete ui;
}

WidgetSuperList * PanelSuperList::list() const {
    return ui->widgetList;
}

QLineEdit * PanelSuperList::lineEditName() const {
    return ui->lineEditName;
}

QPushButton * PanelSuperList::buttonMaximum() const {
    return ui->pushButtonMaximum;
}

void PanelSuperList::setIsLang(bool lang) {
    m_isLang = lang;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelSuperList::initializeModel(QStandardItemModel *m) {
    list()->initializeModel(m);
    connect(list()->selectionModel(), SIGNAL(currentChanged(QModelIndex,
        QModelIndex)), this, SLOT(on_listIndexChanged(QModelIndex, QModelIndex)));
    connect(ui->widgetTextLang, SIGNAL(mainChanged(const QString &)), this,
        SLOT(onlangTextChanged(const QString &)));
}

// -------------------------------------------------------

void PanelSuperList::showButtonMax(bool b) {
    if (b)
        ui->pushButtonMaximum->show();
    else
        ui->pushButtonMaximum->hide();
}

// -------------------------------------------------------

void PanelSuperList::setMaximumLimit(int max) {
    m_maximum = max;
}

// -------------------------------------------------------

void PanelSuperList::showEditName(bool b) {
    if (b) {
        ui->label->show();
        if (m_isLang) {
            ui->widgetTextLang->show();
            ui->lineEditName->hide();
        } else {
            ui->lineEditName->show();
        }
    } else {
        ui->label->hide();
        ui->lineEditName->hide();
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelSuperList::on_lineEditName_textChanged(const QString &s) {
    ui->widgetList->setName(s);

    emit nameChanged(ui->widgetList->getSelected());
}

// -------------------------------------------------------

void PanelSuperList::onlangTextChanged(const QString &s) {
    ui->widgetList->setName(s);
}

// -------------------------------------------------------

void PanelSuperList::on_pushButtonMaximum_pressed() {
    DialogSetMaximum dialog(list()->getModel(), m_maximum);
    if (dialog.exec() == QDialog::Accepted) {
        int newSize = dialog.maximum();
        list()->setMaximum(newSize);
        emit maximumChanged();
    }
}

// -------------------------------------------------------

void PanelSuperList::on_listIndexChanged(QModelIndex index, QModelIndex) {
    QStandardItem *selected = list()->getModel()->itemFromIndex(index);

    if (selected != nullptr) {
        SuperListItem *super = reinterpret_cast<SuperListItem *>(selected
            ->data().value<quintptr>());

        if (m_isLang) {
            SystemLang *lang = reinterpret_cast<SystemLang *>(selected
                ->data().value<quintptr>());
            ui->widgetTextLang->initializeNames(lang);
        } else {
            ui->lineEditName->blockSignals(true);
            ui->lineEditName->setText(super->name());
            ui->lineEditName->blockSignals(false);
        }

        // If ID == -1, can't edit the name
        if (super->id() == -1) {
            ui->lineEditName->setEnabled(false);
        } else {
             ui->lineEditName->setEnabled(true);
        }
    }
}
