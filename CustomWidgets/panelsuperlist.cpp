/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include <QMessageBox>
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
    ui->pushButtonMaximum->setVisible(b);
    ui->pushButtonPlus->setVisible(b);
    ui->pushButtonMinus->setVisible(b);
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

void PanelSuperList::updateMaximum(int max) {
    list()->setMaximum(max);
    emit maximumChanged();
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
        updateMaximum(dialog.maximum());
    }
}

// -------------------------------------------------------

void PanelSuperList::on_pushButtonPlus_pressed() {
    updateMaximum(this->list()->getModel()->rowCount() + 1);
}

// -------------------------------------------------------

void PanelSuperList::on_pushButtonMinus_pressed() {
    int value = this->list()->getModel()->rowCount() - 1;

    if (DialogSetMaximum::isOrderedMax(list()->getModel(), value)) {
        updateMaximum(value);
    } else {
        QMessageBox::information(this, "Warning", DialogSetMaximum::STR_WARNING);
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
            ui->widgetTextLang->initializeNamesLang(lang);
        } else {
            ui->lineEditName->blockSignals(true);
            ui->lineEditName->setText(super->name());
            ui->lineEditName->blockSignals(false);
        }

        // If ID == -1, can't edit the name
        if (super->id() < 1) {
            ui->lineEditName->setEnabled(false);
        } else {
             ui->lineEditName->setEnabled(true);
        }
    }
}
