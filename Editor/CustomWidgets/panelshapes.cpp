/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QDir>
#include <QMessageBox>
#include <QFileDialog>
#include "panelshapes.h"
#include "ui_panelshapes.h"
#include "dialogimportdlcs.h"
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
    m_shape(nullptr),
    m_areNegIDsEnabled(true)
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

    this->translate();
}

PanelShapes::~PanelShapes()
{
    SuperListItem::deleteModel(ui->treeViewAvailableContent->getModel());
    delete ui;
}

SuperListItem * PanelShapes::shape() const {
    return m_shape;
}

void PanelShapes::setShape(SuperListItem *shape) {
    m_shape = shape;
}

void PanelShapes::setAreNegIDsEnabled(bool b) {
    m_areNegIDsEnabled = b;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelShapes::setShapeKind(CustomShapeKind kind) {
    bool isNone = kind == CustomShapeKind::None;
    m_shapeKind = kind;

    showShapes(!isNone);

    if (!isNone) {
        ui->widgetPanelIDs->list()->setAreNegIDsEnabled(m_areNegIDsEnabled);
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
        ui->checkBoxContent->setText(RPM::translate(Translations
            ::SHOW_AVAILABLE_CONTENT) + RPM::SPACE + SystemCustomShape
            ::getLocalFolder(kind));
    }
}

// -------------------------------------------------------

void PanelShapes::changeShape(SuperListItem *shape) {
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
    if (item != nullptr) {
        ui->widgetPreviewObject3D->show();
        SystemCustomShape *super = reinterpret_cast<SystemCustomShape *>(item
            ->data().value<qintptr>());
        if (m_shape != nullptr) {
            m_shape->setId(super->id());
            m_shape->setName(super->name());
        }
        if (m_shapeKind == CustomShapeKind::OBJ) {
            ui->widgetPreviewObject3D->show();
            super->loadCustomObj();
            ui->widgetPreviewObject3D->loadShape(super);
            ui->widgetPreviewObject3D->updateObject();
        }
    } else {
        ui->widgetPreviewObject3D->hide();
    }
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
    loadContentFromFolder(SystemCustomShape::getFolder(m_shapeKind));
    loadContentFromFolder(SystemCustomShape::getFolder(m_shapeKind, true), true);
    DlcsDatas *datas = RPM::get()->project()->gameDatas()->dlcsDatas();
    QString dlc;
    for (int i = 0, l = datas->dlcsCount(); i < l; i++)
    {
        dlc = datas->dlcAt(i);
        loadContentFromFolder(SystemCustomShape::getFolder(m_shapeKind, false,
            dlc), false, dlc);
    }

    // Reselect index
    if (row != -1 && row != -2) {
        QModelIndex index = ui->treeViewAvailableContent->getModel()->index(row,
            0);
        ui->treeViewAvailableContent->setCurrentIndex(index);
    }
}

// -------------------------------------------------------

void PanelShapes::loadContentFromFolder(QString path, bool isBR,  QString dlc) {
    QDir dir(path);
    QStringList files = dir.entryList(QDir::Files);
    QIcon icon = QIcon(isBR ? SuperListItem::pathIconBlue : (dlc.isEmpty() ?
        SuperListItem::pathIconRed : RPM::PATH_ICON_GREEN));
    QStandardItem *item;
    SystemCustomShape *super;

    for (int i = 0; i < files.size(); i++) {
        super = new SystemCustomShape(1, files.at(i), isBR, dlc, m_shapeKind);
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
        QMessageBox::warning(this, RPM::translate(Translations::WARNING), RPM
            ::translate(Translations::COULD_NOT_DELETE_FILE_AT) + RPM::SPACE +
            path + RPM::DOT);
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

//-------------------------------------------------

void PanelShapes::translate()
{
    ui->checkBoxContent->setText(RPM::translate(Translations
        ::SHOW_AVAILABLE_CONTENT));
    ui->pushButtonRefresh->setText(RPM::translate(Translations::REFRESH));
    ui->pushButtonDLC->setText(RPM::translate(Translations::IMPORT_DLC_S) + RPM
        ::DOT_DOT_DOT);
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
    RPM::get()->engineSettings()->setShowAvailableContent(b);
    RPM::get()->engineSettings()->write();
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
    QStringList files = QFileDialog::getOpenFileNames(this, RPM::translate(
        Translations::ADD_NEW_CONTENTS), "", SystemCustomShape
        ::getShapeExtensionBrowse(m_shapeKind));
    QString path;

    // Copy all the selected files
    for (int i = 0; i < files.size(); i++) {
        path = files.at(i);
        if (!QFile::copy(path, Common::pathCombine(SystemCustomShape::getFolder(
            m_shapeKind, false), QFileInfo(path).fileName())))
        {
            QMessageBox::warning(this, RPM::translate(Translations::WARNING),
                RPM::translate(Translations::COULD_NOT_COPY_FILE_AT) + RPM
                ::SPACE + path + RPM::DOT);
        }
    }

    // Refresh content
    loadAvailableContent();
}

// -------------------------------------------------------

void PanelShapes::deletingContent(SuperListItem *super, int row) {
    QString path = reinterpret_cast<SystemCustomShape *>(super)->getPath();

    // If is BR, ask if sure action before
    if (reinterpret_cast<SystemCustomShape *>(super)->isBR()) {
        loadAvailableContent(row);
        QMessageBox::StandardButton box = QMessageBox::question(this, RPM
            ::translate(Translations::DELETING_SHAPE), RPM::translate(
            Translations::YOUR_TRYING_REMOVE_BR_SHAPE) + RPM::DOT + RPM::SPACE +
            RPM::translate(Translations::ARE_YOU_SURE_WANT_DO_IT), QMessageBox
            ::Yes | QMessageBox::No);

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

// -------------------------------------------------------

void PanelShapes::on_pushButtonDLC_clicked()
{
    DialogImportDLCs dialog;
    if (dialog.exec() == QDialog::Accepted) {
        RPM::get()->project()->writeDlcs();
        loadAvailableContent(0);
    } else
    {
        RPM::get()->project()->readDlcs();
    }
}

// -------------------------------------------------------

void PanelShapes::on_pushButtonExport_clicked()
{
    QStandardItem *selected = ui->treeViewAvailableContent->getSelected();
    if (selected != nullptr)
    {
        QString folder = QFileDialog::getExistingDirectory(this, RPM::translate(
            Translations::CHOOSE_LOCATION) + RPM::DOT_DOT_DOT);
        SystemPicture *picture = reinterpret_cast<SystemPicture *>(selected
            ->data().value<quintptr>());
        if (folder.isEmpty())
        {
            Common::copyPath(picture->getPath(), Common::pathCombine(folder,
                picture->name()));
        }
    }
}
