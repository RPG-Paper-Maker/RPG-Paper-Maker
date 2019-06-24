/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "widgetshape.h"
#include "ui_widgetshape.h"
#include "rpm.h"
#include "dialogshapespreview.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetShape::WidgetShape(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::WidgetShape),
    m_shapeID(nullptr)
{
    ui->setupUi(this);

    QListWidgetItem* item = new QListWidgetItem;
    item->setSizeHint(QSize(item->sizeHint().width(), ui->listWidget->height() -
        4));
    ui->listWidget->addItem(item);
}

WidgetShape::~WidgetShape() {
    delete ui;
}

QListWidget* WidgetShape::list() const { return ui->listWidget; }

void WidgetShape::setKind(CustomShapeKind kind){
    m_kind = kind;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetShape::initialize(SuperListItem *shapeID) {
    m_shapeID = shapeID;

    update();
}

// -------------------------------------------------------

void WidgetShape::update() {
    ui->listWidget->item(0)->setText(m_shapeID->toString());
}

// -------------------------------------------------------

void WidgetShape::openDialog(){
    DialogShapesPreview dialog(m_shapeID, m_kind);
    int previousID = m_shapeID->id();
    if (dialog.exec() == QDialog::Accepted) {
        update();

        if (previousID != m_shapeID->id()) {
            emit shapeChanged();
        }
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void WidgetShape::on_listWidget_itemDoubleClicked(QListWidgetItem*) {
    openDialog();
}

// -------------------------------------------------------

void WidgetShape::on_pushButton_clicked() {
    openDialog();
}
