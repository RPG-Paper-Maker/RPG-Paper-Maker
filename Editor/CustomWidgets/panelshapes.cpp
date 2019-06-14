/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include <QDir>
#include <QMessageBox>
#include <QFileDialog>
#include "panelshapes.h"
#include "ui_panelshapes.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelShapes::PanelShapes(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelShapes),
    m_shapeKind(CustomShapeKind::None),
    m_shape(nullptr)
{
    ui->setupUi(this);

    ui->widgetPanelIDs->showButtonMax(false);
    ui->widgetPanelIDs->list()->setCanBrutRemove(true);
    ui->widgetPanelIDs->list()->setHasContextMenu(false);
    connect(ui->checkBoxContent, SIGNAL(toggled(bool)), this, SLOT(
        showAvailableContent(bool)));

    // Available content
    ui->treeViewAvailableContent->initializeModel(new QStandardItemModel);
    ui->treeViewAvailableContent->setHasContextMenu(false);
    ui->treeViewAvailableContent->setCanBeControled(false);
    ui->treeViewAvailableContent->setCanMove(false);
    ui->treeViewAvailableContent->setUpdateId(true);

    connect(ui->treeViewAvailableContent, SIGNAL(deletingItem(SuperListItem*,
        int)), this, SLOT(deletingContent(SuperListItem *, int)));
    connect(ui->treeViewAvailableContent, SIGNAL(doubleClicked(QModelIndex)),
        this, SLOT(on_treeViewAvailableContentDoubleClicked(QModelIndex)));
}

PanelShapes::~PanelShapes()
{
    SuperListItem::deleteModel(ui->treeViewAvailableContent->getModel());
    delete ui;
}

SystemCustomShape * PanelShapes::shape() const {
    return m_shape;
}

void PanelShapes::setShape(SystemCustomShape *shape) {
    m_shape = shape;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelShapes::setCustomShapeKind(CustomShapeKind kind) {
    bool isNone = kind == CustomShapeKind::None;
    m_shapeKind = kind;

    showShapes(!isNone);

    if (!isNone) {
        ui->widgetPanelIDs->initializeModel(RPM::get()->project()->shapesDatas()
            ->model(kind));

        // Connection of list
        connect(ui->widgetPanelIDs->list()->selectionModel(), SIGNAL(
            currentChanged(QModelIndex, QModelIndex)), this, SLOT(
            on_listIDsIndexChanged(QModelIndex, QModelIndex)));

        QModelIndex index = ui->widgetPanelIDs->list()->getModel()->index(0, 0);
        ui->widgetPanelIDs->list()->setCurrentIndex(index);


        // Loading first available content
        loadAvailableContent(-2);

        connect(ui->treeViewAvailableContent->selectionModel(), SIGNAL(
            currentChanged(QModelIndex,QModelIndex)), this, SLOT(
            on_listIndexChanged(QModelIndex,QModelIndex)));

        // Update checkBox
        ui->checkBoxContent->setText("Show available content of " +
            SystemCustomShape::getLocalFolder(kind));
    }
}

// -------------------------------------------------------

void PanelShapes::changeShape(SystemCustomShape *shape) {
    setShape(shape);

    int index = SuperListItem::getIndexById(ui->widgetPanelIDs->list()
        ->getModel()->invisibleRootItem(), shape->id());
    QModelIndex indexModel = ui->widgetPanelIDs->list()->getModel()->index(
        index, 0);
    ui->widgetPanelIDs->list()->setCurrentIndex(indexModel);
}

// -------------------------------------------------------

void PanelShapes::showShapes(bool b) {
    this->setVisible(b);
}

// -------------------------------------------------------

void PanelShapes::updateShapeItem(QStandardItem *item) {
    // TODO
}

// -------------------------------------------------------

void PanelShapes::loadAvailableContent(int row) {
    if (row == -1) {
        QStandardItem *item = ui->treeViewAvailableContent->getSelected();
        if (item != nullptr)
            row = item->row();
    }

    // Clear
    SuperListItem::deleteModel(ui->treeViewAvailableContent->getModel(), false);
    ui->treeViewAvailableContent->getModel()->clear();

    // Load content from folders
    loadContentFromFolder(SystemCustomShape::getFolder(m_shapeKind, false), false);
    loadContentFromFolder(SystemCustomShape::getFolder(m_shapeKind, true), true);

    // Reselect index
    if (row != -1 && row != -2) {
        QModelIndex index = ui->treeViewAvailableContent->getModel()->index(row,
            0);
        ui->treeViewAvailableContent->setCurrentIndex(index);
    }
}

// -------------------------------------------------------

void PanelShapes::loadContentFromFolder(QString path, bool isBR) {
    QDir dir(path);
    QStringList files = dir.entryList(QDir::Files);
    QIcon icon = isBR ? QIcon(SuperListItem::pathIconBlue) :
        QIcon(SuperListItem::pathIconRed);
    QStandardItem *item;
    SystemCustomShape *super;

    for (int i = 0; i < files.size(); i++) {
        super = new SystemCustomShape(1, files.at(i), isBR);
        item = new QStandardItem;
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(super)));
        item->setIcon(icon);
        item->setText(super->name());
        ui->treeViewAvailableContent->getModel()->appendRow(item);
    }
}

// -------------------------------------------------------

void PanelShapes::deleteContent(QString path) {
    if (!QFile(path).remove()) {
        QMessageBox::warning(this, "Warning", "Could not delete file at " + path);
    }
}

// -------------------------------------------------------

void PanelShapes::moveContent() {
    QStandardItem *selected = ui->treeViewAvailableContent->getSelected();
    SystemCustomShape *super;

    if (selected != nullptr) {
        super = reinterpret_cast<SystemCustomShape *>(selected->data()
            .value<qintptr>());
        ui->widgetPanelIDs->list()->addNewItem(super);
    }
}

// -------------------------------------------------------

void PanelShapes::updateShape() {
    m_shape = reinterpret_cast<SystemCustomShape *>(ui->widgetPanelIDs->list()
        ->getSelected()->data().value<qintptr>());
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelShapes::showAvailableContent(bool b) {
    ui->checkBoxContent->setChecked(b);
    ui->treeViewAvailableContent->setVisible(b);
    ui->pushButtonMove->setVisible(b);
    ui->pushButtonRefresh->setVisible(b);
    ui->pushButtonAdd->setVisible(b);
}

// -------------------------------------------------------

void PanelShapes::on_listIDsIndexChanged(QModelIndex index, QModelIndex)
{
    updateShapeItem(ui->widgetPanelIDs->list()->getModel()->itemFromIndex(index));
}

// -------------------------------------------------------

void PanelShapes::on_listIndexChanged(QModelIndex index, QModelIndex)
{
    updateShapeItem(ui->treeViewAvailableContent->getModel()->itemFromIndex(index));
}

// -------------------------------------------------------

void PanelShapes::on_pushButtonMove_clicked() {
    moveContent();
}

// -------------------------------------------------------

void PanelShapes::on_pushButtonRefresh_clicked() {
    loadAvailableContent();
}

// -------------------------------------------------------

void PanelShapes::on_pushButtonAdd_clicked() {

    // Open dialog box
    QStringList files = QFileDialog::getOpenFileNames(this, "Add new contents",
        "", SystemCustomShape::getShapeExtensionBrowse(m_shapeKind));
    QString path;

    // Copy all the selected files
    for (int i = 0; i < files.size(); i++) {
        path = files.at(i);
        if (!QFile::copy(path, Common::pathCombine(SystemCustomShape::getFolder(
            m_shapeKind, false), QFileInfo(path).fileName())))
        {
            QMessageBox::warning(this, "Warning", "Could not copy file at " +
                path);
        }
    }

    // Refresh content
    loadAvailableContent();
}

// -------------------------------------------------------

void PanelShapes::deletingContent(SuperListItem *super, int row) {
    QString path = reinterpret_cast<SystemCustomShape *>(super)->getPath(
        m_shapeKind);

    // If is BR, ask if sure action before
    if (reinterpret_cast<SystemCustomShape *>(super)->isBR()) {
        loadAvailableContent(row);
        QMessageBox::StandardButton box = QMessageBox::question(this,
            "Deleting image", "You are trying to remove a BR shape. "
            "Are you sure you want to do it?", QMessageBox::Yes | QMessageBox::No);

        if (box == QMessageBox::Yes) {
            deleteContent(path);
            loadAvailableContent();
        }
    }
    else
        deleteContent(path);
}

// -------------------------------------------------------

void PanelShapes::on_treeViewAvailableContentDoubleClicked(QModelIndex)
{
    moveContent();
}
