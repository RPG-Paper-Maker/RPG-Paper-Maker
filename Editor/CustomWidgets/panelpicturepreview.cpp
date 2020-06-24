/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QDirIterator>
#include <QFileDialog>
#include <QMessageBox>
#include "panelpicturepreview.h"
#include "ui_panelpicturepreview.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelPicturePreview::PanelPicturePreview(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelPicturePreview),
    m_pictureKind(PictureKind::None),
    m_picture(nullptr),
    m_areNegIDsEnabled(true)
{
    ui->setupUi(this);
    ui->groupBoxOptions->hide();

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

PanelPicturePreview::~PanelPicturePreview()
{
    SuperListItem::deleteModel(ui->treeViewAvailableContent->getModel());
    delete ui;
}

SystemPicture * PanelPicturePreview::picture() const {
    return m_picture;
}

void PanelPicturePreview::setPicture(SystemPicture *picture) {
    m_picture = picture;
}

int PanelPicturePreview::indexX() const {
    return ui->widgetPreview->indexX();
}

void PanelPicturePreview::setIndexX(int i) {
    ui->widgetPreview->setIndexX(i);
}

int PanelPicturePreview::indexY() const {
    return ui->widgetPreview->indexY();
}

void PanelPicturePreview::setIndexY(int i) {
    ui->widgetPreview->setIndexY(i);
}

void PanelPicturePreview::setCurrentTexture(QRect& rect) {
    ui->widgetTileset->setCurrentTexture(rect);
}

void PanelPicturePreview::currentTexture(QRect& rect) const{
    ui->widgetTileset->currentTexture(rect);
}

void PanelPicturePreview::setAreNegIDsEnabled(bool b) {
    m_areNegIDsEnabled = b;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelPicturePreview::setChooseRect(bool b) {
    ui->widgetPreview->setChooseRect(b);
    if (b)
        ui->groupBoxOptions->show();
}

// -------------------------------------------------------

void PanelPicturePreview::setPictureKind(PictureKind kind) {
    bool isNone = kind == PictureKind::None;
    m_pictureKind = kind;
    ui->widgetPreview->setKind(kind);

    showPictures(!isNone);

    if (!isNone) {
        ui->widgetPanelIDs->list()->setAreNegIDsEnabled(m_areNegIDsEnabled);
        ui->widgetPanelIDs->initializeModel(RPM::get()->project()
            ->picturesDatas()->model(kind));

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
            ::SHOW_AVAILABLE_CONTENT) + RPM::SPACE + SystemPicture
            ::getLocalFolder(kind));
    }
}

// -------------------------------------------------------

void PanelPicturePreview::changePicture(SystemPicture *picture) {
    setPicture(picture);

    int index = SuperListItem::getIndexById(ui->widgetPanelIDs->list()
        ->getModel()->invisibleRootItem(), picture->id());
    QModelIndex indexModel = ui->widgetPanelIDs->list()->getModel()->index(
        index, 0);
    ui->widgetPanelIDs->list()->setCurrentIndex(indexModel);
}

// -------------------------------------------------------

void PanelPicturePreview::showPictures(bool b) {
    this->setVisible(b);
}

// -------------------------------------------------------

void PanelPicturePreview::updateImage(QStandardItem *item) {
    if (item != nullptr) {
        m_picture = reinterpret_cast<SystemPicture *>(item->data()
            .value<qintptr>());
        if (m_picture != nullptr) {
            if (m_picture->id() == -1) {
                showPictureWidget(true);
                ui->widgetPreview->setNoneImage();
            } else if (m_picture->id() == 0) {
                showPictureWidget(false);
                ui->widgetTileset->setImage(RPM::get()->project()->currentMap(
                    true)->mapProperties()->tileset()->picture()->getPath(
                    PictureKind::Tilesets));
            }
            else {
                showPictureWidget(true);
                ui->widgetPreview->setImage(m_picture->getPath(m_pictureKind));
            }
            ui->widgetPreview->repaint();
        }
    } else{
        ui->widgetPreview->setNoneImage();
        ui->widgetPreview->repaint();
    }
}

// -------------------------------------------------------

void PanelPicturePreview::loadAvailableContent(int row) {
    if (row == -1) {
        QStandardItem *item = ui->treeViewAvailableContent->getSelected();
        if (item != nullptr)
            row = item->row();
    }

    // Clear
    SuperListItem::deleteModel(ui->treeViewAvailableContent->getModel(), false);
    ui->treeViewAvailableContent->getModel()->clear();

    // Load content from folders
    loadContentFromFolder(SystemPicture::getFolder(m_pictureKind, false), false);
    loadContentFromFolder(SystemPicture::getFolder(m_pictureKind, true), true);

    // Reselect index
    if (row != -1 && row != -2) {
        QModelIndex index = ui->treeViewAvailableContent->getModel()->index(row,
            0);
        ui->treeViewAvailableContent->setCurrentIndex(index);
    }
}

// -------------------------------------------------------

void PanelPicturePreview::loadContentFromFolder(QString path, bool isBR) {
    QDir dir(path);
    QStringList files = dir.entryList(QDir::Files);
    QIcon icon = isBR ? QIcon(SuperListItem::pathIconBlue) :
        QIcon(SuperListItem::pathIconRed);
    QStandardItem *item;
    SystemPicture *super;

    for (int i = 0; i < files.size(); i++) {
        super = new SystemPicture(1, files.at(i), isBR);
        item = new QStandardItem;
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(super)));
        item->setIcon(icon);
        item->setText(super->name());
        ui->treeViewAvailableContent->getModel()->appendRow(item);
    }
}

// -------------------------------------------------------

void PanelPicturePreview::deleteContent(QString path) {
    if (!QFile(path).remove()) {
        QMessageBox::warning(this, RPM::translate(Translations::WARNING), RPM
            ::translate(Translations::COULD_NOT_DELETE_FILE_AT) + RPM::SPACE +
            path + RPM::DOT);
    }
}

// -------------------------------------------------------

void PanelPicturePreview::moveContent() {
    QStandardItem *selected = ui->treeViewAvailableContent->getSelected();
    SystemPicture *super;

    if (selected != nullptr) {
        super = reinterpret_cast<SystemPicture *>(selected->data()
            .value<qintptr>());
        ui->widgetPanelIDs->list()->addNewItem(super);
    }
}

// -------------------------------------------------------

void PanelPicturePreview::updatePicture() {
    m_picture = reinterpret_cast<SystemPicture *>(ui->widgetPanelIDs->list()
        ->getSelected()->data().value<qintptr>());
}

// -------------------------------------------------------

void PanelPicturePreview::showPictureWidget(bool b) {
    ui->widgetPreview->setVisible(b);
    ui->widgetTileset->setVisible(!b);
}

//-------------------------------------------------

void PanelPicturePreview::translate()
{
    ui->checkBoxContent->setText(RPM::translate(Translations
        ::SHOW_AVAILABLE_CONTENT));
    ui->groupBoxOptions->setTitle(RPM::translate(Translations::OPTIONS));
    ui->pushButtonRefresh->setText(RPM::translate(Translations::REFRESH));
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelPicturePreview::showAvailableContent(bool b) {
    ui->checkBoxContent->setChecked(b);
    ui->treeViewAvailableContent->setVisible(b);
    ui->pushButtonMove->setVisible(b);
    ui->pushButtonRefresh->setVisible(b);
    ui->pushButtonAdd->setVisible(b);
    RPM::get()->engineSettings()->setShowAvailableContent(b);
    RPM::get()->engineSettings()->write();
}

// -------------------------------------------------------

void PanelPicturePreview::on_listIDsIndexChanged(QModelIndex index, QModelIndex)
{
    updateImage(ui->widgetPanelIDs->list()->getModel()->itemFromIndex(index));
}

// -------------------------------------------------------

void PanelPicturePreview::on_listIndexChanged(QModelIndex index, QModelIndex)
{
    updateImage(ui->treeViewAvailableContent->getModel()->itemFromIndex(index));
}

// -------------------------------------------------------

void PanelPicturePreview::on_pushButtonMove_clicked() {
    moveContent();
}

// -------------------------------------------------------

void PanelPicturePreview::on_pushButtonRefresh_clicked() {
    loadAvailableContent();
}

// -------------------------------------------------------

void PanelPicturePreview::on_pushButtonAdd_clicked() {

    // Open dialog box
    QStringList files = QFileDialog::getOpenFileNames(this, RPM::translate(
        Translations::ADD_NEW_CONTENTS), "", "Image (*.png *.jpg)");
    QString path;

    // Copy all the selected files
    for (int i = 0; i < files.size(); i++) {
        path = files.at(i);
        if (!QFile::copy(path, Common::pathCombine(SystemPicture::getFolder(
            m_pictureKind, false), QFileInfo(path).fileName())))
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

void PanelPicturePreview::deletingContent(SuperListItem *super, int row) {
    QString path = reinterpret_cast<SystemPicture *>(super)->getPath(m_pictureKind);

    // If is BR, ask if sure action before
    if (reinterpret_cast<SystemPicture *>(super)->isBR()) {
        loadAvailableContent(row);
        QMessageBox::StandardButton box = QMessageBox::question(this, RPM
            ::translate(Translations::DELETING_IMAGE), RPM::translate(
            Translations::YOUR_TRYING_REMOVE_BR_IMAGE) + RPM::DOT + RPM::SPACE +
            RPM::translate(Translations::ARE_YOU_SURE_WANT_DO_IT), QMessageBox::Yes |
            QMessageBox::No);

        if (box == QMessageBox::Yes) {
            deleteContent(path);
            loadAvailableContent();
        }
    }
    else
        deleteContent(path);
}

// -------------------------------------------------------

void PanelPicturePreview::on_treeViewAvailableContentDoubleClicked(QModelIndex)
{
    moveContent();
}
