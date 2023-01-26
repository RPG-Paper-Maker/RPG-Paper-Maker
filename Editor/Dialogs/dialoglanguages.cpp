/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialoglanguages.h"
#include "ui_dialoglanguages.h"
#include "systemlanguage.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogLanguages::DialogLanguages(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogLanguages)
{
    ui->setupUi(this);
    this->initialize();
    this->translate();
}

DialogLanguages::~DialogLanguages()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogLanguages::initialize()
{
    ui->treeViewLanguages->initializeNewItemInstance(new SystemLanguage);
    ui->treeViewLanguages->initializeModel(RPM::get()->project()->langsDatas()->model());
    ui->treeViewLanguages->setCanBeEmpty(false);
    ui->treeViewLanguages->setUpdateId(true);
    ui->widgetTextLangLoadAGame->initializeNamesLang(RPM::get()->project()->langsDatas()->loadAGame());
    ui->widgetTextLangLoadAGameDescription->initializeNamesLang(RPM::get()->project()->langsDatas()->loadAGameDescription());
    ui->widgetTextLangSlot->initializeNamesLang(RPM::get()->project()->langsDatas()->slot());
    ui->widgetTextLangEmpty->initializeNamesLang(RPM::get()->project()->langsDatas()->empty());
    ui->widgetTextLangSaveAGame->initializeNamesLang(RPM::get()->project()->langsDatas()->saveAGame());
    ui->widgetTextLangSaveAGameDescription->initializeNamesLang(RPM::get()->project()->langsDatas()->saveAGameDescription());
    ui->widgetTextLangKeyboardAssignment->initializeNamesLang(RPM::get()->project()->langsDatas()->keyboardAssignment());
    ui->widgetTextLangKeyboardAssignmentDescription->initializeNamesLang(RPM::get()->project()->langsDatas()->keyboardAssignmentDescription());
    ui->widgetTextLangKeyboardAssignmentSelectedDescription->initializeNamesLang(RPM::get()->project()->langsDatas()->keyboardAssignmentSelectedDescription());
    ui->widgetTextLangLanguage->initializeNamesLang(RPM::get()->project()->langsDatas()->language());
    ui->widgetTextLangLanguageDescription->initializeNamesLang(RPM::get()->project()->langsDatas()->languageDescription());
    ui->widgetTextLangLanguageSelectedDescription->initializeNamesLang(RPM::get()->project()->langsDatas()->languageSelectedDescription());
    ui->widgetTextLangConfirm->initializeNamesLang(RPM::get()->project()->langsDatas()->confirm());
    ui->widgetTextLangOK->initializeNamesLang(RPM::get()->project()->langsDatas()->ok());
    ui->widgetTextLangYes->initializeNamesLang(RPM::get()->project()->langsDatas()->yes());
    ui->widgetTextLangNo->initializeNamesLang(RPM::get()->project()->langsDatas()->no());
    ui->widgetTextLangAdd->initializeNamesLang(RPM::get()->project()->langsDatas()->add());
    ui->widgetTextLangRemove->initializeNamesLang(RPM::get()->project()->langsDatas()->remove());
    ui->widgetTextLangShop->initializeNamesLang(RPM::get()->project()->langsDatas()->shop());
    ui->widgetTextLangBuy->initializeNamesLang(RPM::get()->project()->langsDatas()->buy());
    ui->widgetTextLangSell->initializeNamesLang(RPM::get()->project()->langsDatas()->sell());
    ui->widgetTextLangOwned->initializeNamesLang(RPM::get()->project()->langsDatas()->owned());
    ui->widgetTextLangSelectAnAlly->initializeNamesLang(RPM::get()->project()->langsDatas()->selectAnAlly());
    ui->widgetTextLangVictory->initializeNamesLang(RPM::get()->project()->langsDatas()->victory());
    ui->widgetTextLangDefeat->initializeNamesLang(RPM::get()->project()->langsDatas()->defeat());
    ui->widgetTextLangLevelUp->initializeNamesLang(RPM::get()->project()->langsDatas()->levelUp());
    ui->widgetTextLangPrecision->initializeNamesLang(RPM::get()->project()->langsDatas()->precision());
    ui->widgetTextLangCritical->initializeNamesLang(RPM::get()->project()->langsDatas()->critical());
    ui->widgetTextLangDamage->initializeNamesLang(RPM::get()->project()->langsDatas()->damage());
    ui->widgetTextLangHeal->initializeNamesLang(RPM::get()->project()->langsDatas()->heal());
    ui->widgetTextLangSkill->initializeNamesLang(RPM::get()->project()->langsDatas()->skill());
    ui->widgetTextLangPerformSkill->initializeNamesLang(RPM::get()->project()->langsDatas()->performSkill());
    ui->widgetTextLangLoading->initializeNamesLang(RPM::get()->project()->langsDatas()->loading());
    ui->widgetTextLangEquipQuestion->initializeNamesLang(RPM::get()->project()->langsDatas()->equipQuestion());
    ui->widgetTextLangPressAnyKeys->initializeNamesLang(RPM::get()->project()->langsDatas()->pressAnyKeys());
    ui->widgetTextLangTarget->initializeNamesLang(RPM::get()->project()->langsDatas()->target());
}

// -------------------------------------------------------

void DialogLanguages::translate()
{
    this->setWindowTitle(RPM::translate(Translations::LANGUAGES_MANAGER) + RPM
        ::DOT_DOT_DOT);
    ui->tabWidget->setTabText(0, RPM::translate(Translations::LANGUAGES));
    ui->tabWidget->setTabText(1, RPM::translate(Translations::EXTRA_WORDS));
    ui->labelLoadAGame->setText(RPM::translate(Translations::LOAD_GAME) + RPM::COLON);
    ui->labelLoadAGameDescription->setText(RPM::translate(Translations::LABEL_LOAD_GAME_DESCRIPTION) + RPM::COLON);
    ui->labelSlot->setText(RPM::translate(Translations::SLOT_NAME) + RPM::COLON);
    ui->labelEmpty->setText(RPM::translate(Translations::EMPTY) + RPM::COLON);
    ui->labelSaveAGame->setText(RPM::translate(Translations::SAVE_GAME) + RPM::COLON);
    ui->labelSaveAGameDescription->setText(RPM::translate(Translations::LABEL_SAVE_GAME_DESCRIPTION) + RPM::COLON);
    ui->labelKeyboardAssignment->setText(RPM::translate(Translations::KEYBOARD_ASSIGNMENTS) + RPM::COLON);
    ui->labelKeyboardAssignmentDescription->setText(RPM::translate(Translations::LABEL_KEYBOARD_ASSIGNMENTS_DESCRIPTION) + RPM::COLON);
    ui->labelKeyboardAssignmentSelectedDescription->setText(RPM::translate(Translations::LABEL_KEYBOARD_ASSIGNMENTS_SELECTED_DESCRIPTION) + RPM::COLON);
    ui->labelLanguage->setText(RPM::translate(Translations::LANGUAGE) + RPM::COLON);
    ui->labelLanguageDescription->setText(RPM::translate(Translations::LABEL_LANGUAGE_DESCRIPTION) + RPM::COLON);
    ui->labelLanguageSelectedDescription->setText(RPM::translate(Translations::LABEL_LANGUAGE_SELECTED_DESCRIPTION) + RPM::COLON);
    ui->labelConfirm->setText(RPM::translate(Translations::LABEL_CONFIRM_QUESTION) + RPM::COLON);
    ui->labelOK->setText(RPM::translate(Translations::OK) + RPM::COLON);
    ui->labelYes->setText(RPM::translate(Translations::YES) + RPM::COLON);
    ui->labelNo->setText(RPM::translate(Translations::NO) + RPM::COLON);
    ui->labelAdd->setText(RPM::translate(Translations::ADD) + RPM::COLON);
    ui->labelRemove->setText(RPM::translate(Translations::REMOVE) + RPM::COLON);
    ui->labelShop->setText(RPM::translate(Translations::SHOP) + RPM::COLON);
    ui->labelBuy->setText(RPM::translate(Translations::BUY) + RPM::COLON);
    ui->labelSell->setText(RPM::translate(Translations::SELL) + RPM::COLON);
    ui->labelOwned->setText(RPM::translate(Translations::OWNED) + RPM::COLON);
    ui->labelSelectAnAlly->setText(RPM::translate(Translations::SELECT_AN_ALLY) + RPM::COLON);
    ui->labelVictory->setText(RPM::translate(Translations::VICTORY) + RPM::COLON);
    ui->labelDefeat->setText(RPM::translate(Translations::DEFEAT) + RPM::COLON);
    ui->labelLevelUp->setText(RPM::translate(Translations::LEVEL_UP) + RPM::COLON);
    ui->labelPrecision->setText(RPM::translate(Translations::PRECISION) + RPM::COLON);
    ui->labelCritical->setText(RPM::translate(Translations::CRITICAL) + RPM::COLON);
    ui->labelDamage->setText(RPM::translate(Translations::DAMAGE) + RPM::COLON);
    ui->labelHeal->setText(RPM::translate(Translations::HEAL) + RPM::COLON);
    ui->labelSkill->setText(RPM::translate(Translations::SKILL) + RPM::COLON);
    ui->labelPerformSkill->setText(RPM::translate(Translations::PERFORM_SKILL) + RPM::COLON);
    ui->labelLoading->setText(RPM::translate(Translations::LOADING) + RPM::COLON);
    ui->labelEquipQuestion->setText(RPM::translate(Translations::LABEL_EQUIP_QUESTION) + RPM::COLON);
    ui->labelPressAnyKeys->setText(RPM::translate(Translations::LABEL_PRESS_ANY_KEYS) + RPM::COLON);
    ui->labelTarget->setText(RPM::translate(Translations::TARGET) + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}
