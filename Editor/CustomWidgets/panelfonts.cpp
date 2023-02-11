/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QDir>
#include <QMessageBox>
#include <QFileDialog>
#include <QDesktopServices>
#include "panelfonts.h"
#include "ui_panelfonts.h"
#include "dialogimportdlcs.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelFonts::PanelFonts(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelFonts),
    m_font(nullptr),
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

    // Connections
    connect(ui->treeViewAvailableContent, SIGNAL(deletingItem(SuperListItem *,
        int)), this, SLOT(deletingContent(SuperListItem *, int)));
    connect(ui->treeViewAvailableContent, SIGNAL(doubleClicked(QModelIndex)),
        this, SLOT(on_treeViewAvailableContentDoubleClicked(QModelIndex)));

    this->translate();
}

PanelFonts::~PanelFonts()
{
    SuperListItem::deleteModel(ui->treeViewAvailableContent->getModel());
    delete ui;
}


SuperListItem *PanelFonts::font() const {
    return m_font;
}

void PanelFonts::setFont(SuperListItem *font) {
    m_font = font;
}

void PanelFonts::setAreNegIDsEnabled(bool b) {
    m_areNegIDsEnabled = b;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelFonts::setKind() {
    ui->widgetPanelIDs->list()->setAreNegIDsEnabled(m_areNegIDsEnabled);
    ui->widgetPanelIDs->initializeModel(RPM::get()->project()->fontsDatas()
        ->model());

    // Connection of list
    connect(ui->widgetPanelIDs->list()->selectionModel(), SIGNAL(currentChanged(
        QModelIndex, QModelIndex)), this, SLOT(on_listIDsIndexChanged(
        QModelIndex,QModelIndex)));

    QModelIndex index = ui->widgetPanelIDs->list()->getModel()->index(0, 0);
    ui->widgetPanelIDs->list()->setCurrentIndex(index);

    // Loading first available content
    loadAvailableContent(-2);

    connect(ui->treeViewAvailableContent->selectionModel(), SIGNAL(
        currentChanged(QModelIndex,QModelIndex)), this, SLOT(on_listIndexChanged
        (QModelIndex,QModelIndex)));
}

// -------------------------------------------------------

void PanelFonts::changeFont(SuperListItem *font) {
    this->setFont(font);

    int index = SuperListItem::getIndexById(ui->widgetPanelIDs->list()
        ->getModel()->invisibleRootItem(), font->id());
    QModelIndex indexModel = ui->widgetPanelIDs->list()->getModel()->index(
        index, 0);
    ui->widgetPanelIDs->list()->setCurrentIndex(indexModel);
}

// -------------------------------------------------------

void PanelFonts::updateFont(QStandardItem *item) {
    if (item != nullptr) {
        SystemFont *font = reinterpret_cast<SystemFont *>(item->data().value<qintptr>());
        if (m_font != nullptr) {
            m_font->setId(font->id());
            m_font->setName(font->name());
        }
    }
}

// -------------------------------------------------------

void PanelFonts::loadAvailableContent(int row) {
    if (row == -1) {
        QStandardItem *item = ui->treeViewAvailableContent->getSelected();
        if (item != nullptr)
            row = item->row();
    }

    // Clear
    SuperListItem::deleteModel(ui->treeViewAvailableContent->getModel(), false);
    ui->treeViewAvailableContent->getModel()->clear();

    // Load content from folders
    loadContentFromFolder(SystemFont::getFolder());
    loadContentFromFolder(SystemFont::getFolder(true), true);
    DlcsDatas *datas = RPM::get()->project()->gameDatas()->dlcsDatas();
    QString dlc;
    for (int i = 0, l = datas->dlcsCount(); i < l; i++)
    {
        dlc = datas->dlcAt(i);
        loadContentFromFolder(SystemFont::getFolder(false, dlc), false, dlc);
    }

    // Reselect index
    if (row != -1 && row != -2) {
        QModelIndex index = ui->treeViewAvailableContent->getModel()->index(row,
            0);
        ui->treeViewAvailableContent->setCurrentIndex(index);
    }
}

// -------------------------------------------------------

void PanelFonts::loadContentFromFolder(QString path, bool isBR, QString dlc) {
    QDir dir(path);
    QStringList files = dir.entryList(QDir::Files);
    QIcon icon = QIcon(isBR ? SuperListItem::pathIconBlue : (dlc.isEmpty() ?
        SuperListItem::pathIconGreen : RPM::PATH_ICON_PURPLE));
    QStandardItem *item;
    SystemFont *super;

    for (int i = 0; i < files.size(); i++) {
        super = new SystemFont(1, files.at(i), isBR, dlc);
        item = new QStandardItem;
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(super)));
        item->setIcon(icon);
        item->setText(super->name());
        ui->treeViewAvailableContent->getModel()->appendRow(item);
    }
}

// -------------------------------------------------------

void PanelFonts::deleteContent(QString path) {
    if (!QFile(path).remove()) {
        QMessageBox::warning(this, RPM::translate(Translations::WARNING), RPM
            ::translate(Translations::COULD_NOT_DELETE_FILE_AT) + RPM::SPACE +
            path + RPM::DOT);
    }
}

// -------------------------------------------------------

void PanelFonts::moveContent(){
    QStandardItem *selected = ui->treeViewAvailableContent->getSelected();
    SystemFont *super;

    if (selected != nullptr) {
        super = reinterpret_cast<SystemFont *>(selected->data().value<qintptr>());
        ui->widgetPanelIDs->list()->addNewItem(super);
    }
}

// -------------------------------------------------------

void PanelFonts::updateFonts() {
    m_font = reinterpret_cast<SystemFont *>(ui->widgetPanelIDs->list()
        ->getSelected()->data().value<qintptr>());
}

//-------------------------------------------------

void PanelFonts::dropFiles(QStringList &files)
{
    QString path;

    // Copy all the selected files
    for (int i = 0; i < files.size(); i++) {
        path = files.at(i);
        if (!QFile::copy(path, Common::pathCombine(SystemFont::getFolder(false)
            , QFileInfo(path).fileName())))
        {
            QMessageBox::warning(this, RPM::translate(Translations::WARNING),
                RPM::translate(Translations::COULD_NOT_COPY_FILE_AT) + RPM
                ::SPACE + path + RPM::DOT);
        }
    }

    // Refresh content
    loadAvailableContent();
}

//-------------------------------------------------

void PanelFonts::translate()
{
    ui->checkBoxContent->setText(RPM::translate(Translations
        ::SHOW_AVAILABLE_CONTENT));
    ui->pushButtonRefresh->setText(RPM::translate(Translations::REFRESH));
    ui->pushButtonExport->setText(RPM::translate(Translations::EXPORT) + RPM
        ::DOT_DOT_DOT);
    ui->pushButtonDLC->setText(RPM::translate(Translations::IMPORT_DLC_S) + RPM
        ::DOT_DOT_DOT);
    ui->pushButtonOpenDefaultFolder->setText(RPM::translate(Translations::OPEN_DEFAULT_FOLDER) + RPM::DOT_DOT_DOT);
    ui->pushButtonOpenProjectFolder->setText(RPM::translate(Translations::OPEN_PROJECT_FOLDER) + RPM::DOT_DOT_DOT);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelFonts::showAvailableContent(bool b) {
    ui->checkBoxContent->setChecked(b);
    ui->treeViewAvailableContent->setVisible(b);
    ui->pushButtonDelete->setVisible(b);
    ui->pushButtonMove->setVisible(b);
    ui->pushButtonRefresh->setVisible(b);
    ui->pushButtonExport->setVisible(b);
    ui->pushButtonAdd->setVisible(b);
    RPM::get()->engineSettings()->setShowAvailableContent(b);
    RPM::get()->engineSettings()->write();
}

// -------------------------------------------------------

void PanelFonts::on_listIDsIndexChanged(QModelIndex index, QModelIndex)
{
    updateFont(ui->widgetPanelIDs->list()->getModel()->itemFromIndex(index));
}

// -------------------------------------------------------

void PanelFonts::on_listIndexChanged(QModelIndex index, QModelIndex)
{
    updateFont(ui->treeViewAvailableContent->getModel()->itemFromIndex(index));
}

// -------------------------------------------------------

void PanelFonts::on_pushButtonMove_clicked() {
    moveContent();
}

// -------------------------------------------------------

void PanelFonts::on_pushButtonRefresh_clicked() {
    loadAvailableContent();
}

// -------------------------------------------------------

void PanelFonts::on_pushButtonDelete_clicked()
{
    ui->widgetPanelIDs->list()->contextDelete();
}

// -------------------------------------------------------

void PanelFonts::on_pushButtonAdd_clicked() {

    // Open dialog box
    QStringList files = QFileDialog::getOpenFileNames(this, RPM::translate(
        Translations::ADD_NEW_CONTENTS), "", "Fonts (*.ttf *.otf *.woff *.woff2)");
    this->dropFiles(files);
}

// -------------------------------------------------------

void PanelFonts::deletingContent(SuperListItem *super, int row) {
    QString path = reinterpret_cast<SystemFont *>(super)->getPath();

    // If is BR, ask if sure action before
    if (reinterpret_cast<SystemFont *>(super)->isBR())
    {
        loadAvailableContent(row);
        QMessageBox box(QMessageBox::Question, RPM::translate(Translations
            ::DELETING_FONT), RPM::translate(Translations::YOUR_TRYING_REMOVE_BR_FONT)
            + RPM::DOT + RPM::SPACE + RPM::translate(Translations::ARE_YOU_SURE_WANT_DO_IT),
            QMessageBox::Yes | QMessageBox::No);
        box.setButtonText(QMessageBox::Yes, RPM::translate(Translations::YES));
        box.setButtonText(QMessageBox::No, RPM::translate(Translations::NO));
        if (box.exec() == QMessageBox::Yes)
        {
            deleteContent(path);
            loadAvailableContent();
        }
    } else
        deleteContent(path);
}

// -------------------------------------------------------

void PanelFonts::on_treeViewAvailableContentDoubleClicked(QModelIndex) {
    moveContent();
}

// -------------------------------------------------------

void PanelFonts::on_pushButtonDLC_clicked()
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

void PanelFonts::on_pushButtonExport_clicked()
{
    QStandardItem *selected = ui->treeViewAvailableContent->getSelected();
    if (selected != nullptr)
    {
        QString folder = QFileDialog::getExistingDirectory(this, RPM::translate(
            Translations::CHOOSE_LOCATION) + RPM::DOT_DOT_DOT);
        SystemFont *font = reinterpret_cast<SystemFont *>(selected
            ->data().value<quintptr>());
        if (!folder.isEmpty())
        {
            Common::copyPath(font->getPath(), Common::pathCombine(folder,
                font->name()));
        }
    }
}

// -------------------------------------------------------

void PanelFonts::on_pushButtonOpenDefaultFolder_clicked()
{
    QDesktopServices::openUrl(QUrl::fromLocalFile(Common::pathCombine(RPM::get()
        ->project()->gameDatas()->systemDatas()->pathBR(), RPM::PATH_FONTS)));
}

// -------------------------------------------------------

void PanelFonts::on_pushButtonOpenProjectFolder_clicked()
{
    QDesktopServices::openUrl(QUrl::fromLocalFile(Common::pathCombine(RPM::get()
        ->project()->pathCurrentProjectApp(), RPM::PATH_FONTS)));
}
